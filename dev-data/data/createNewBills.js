import Bill from '../../models/billModel.js';
import fs from 'fs';
import { join, resolve } from 'path';
import { connectDB } from '../../config/db.js';

connectDB();
// Resolve paths
const rootDir = resolve();

// Load providers data from JSON file
const providersPath = join(rootDir, 'dev-data', 'data', 'billProviders.json');
const providers = JSON.parse(fs.readFileSync(providersPath, 'utf-8'));
// console.log(providers);

// Load bills data from JSON file
const billsDataPath = join(rootDir, 'dev-data', 'data', 'bills.json');
const billsData = JSON.parse(fs.readFileSync(billsDataPath, 'utf-8'));

/**
 * Import Bills into the database.
 */
const importBills = () => {
  providers.forEach(provider => {
    const plans = billsData[provider.category][provider.key];

    plans.forEach(async plan => {
      try {
        const isElectricity = provider.isElectricity;
        const isAirtime = provider.isAirtime;

        const amount =
          isElectricity || isAirtime
            ? 0
            : parseInt(plan.amount?.replace('NGN', '').trim());

        const serviceFee =
          parseInt(plan.service_fee?.replace('NGN', '').split(' ')[0].trim()) ||
          0; // Extract the fee amount

        let regExpression;

        let groupName;
        let labelName;

        switch (provider.category) {
          case 'airtime':
            groupName = 'Airtime Purchase';
            labelName = 'Mobile Number';
            regExpression =
              /((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/;
            break;
          case 'data':
            groupName = `${provider.name} Data Bundle`;
            labelName = 'Mobile Number';
            regExpression =
              /((^090)([23589]))|((^070)([1-9]))|((^080)([2-9]))|((^081)([0-9]))(\d{7})/;
            break;
          case 'cable-tv':
            groupName = `${provider.name} Subscription`;
            labelName = 'SmartCard Number';
            regExpression = /^[0-9]+$/;
            break;
          case 'electricity':
            groupName = `${provider.name} Bill Payment`;
            labelName = 'Meter Number';
            regExpression = /^[0-9]+$/;
            break;
          default:
            groupName = `${provider.name} Payment`;
            labelName = '';
        }

        await Bill.create({
          billerCode: provider.key,
          name:
            plan.data_plan ||
            plan.plan_name ||
            plan.electricity_plan ||
            `Payment - ${provider.name}`, // For various plans
          defaultCommission: 0, // Default commission for electricity providers
          country: 'NG',
          isAirtime: provider.isAirtime || false,
          billerName: provider.name,
          itemCode: plan.variation_id || plan.item_code || plan.meter_number, // Adjust based on actual field names
          shortName: provider.name,
          fee: serviceFee, // Use serviceFee amount for electricity providers
          commissionOnFee: false,
          regExpression: regExpression, // Assuming numeric meters
          labelName: labelName, // Adjust based on actual field names
          amount: amount, // Electricity plans will have a dynamic amount
          isResolvable: true, // Assuming the value is resolvable, adjust as needed
          groupName: groupName,
          category: provider.category,
          isData: provider.isAirtime ? true : null,
          defaultCommissionOnAmount: null, // Default commission for electricity plans if applicable
          commissionOnFeeOrAmount: null, // Commission calculation based on the amount
          validityPeriod: null,
        });

        console.log(`Bill saved for provider ${provider.name}`);
      } catch (err) {
        console.error(
          `Failed to save bill for provider ${provider.name}:`,
          err.message
        );
        console.error('Stack trace:', err.stack);
      }
    });
  });
};

/**
 * Delete all data from the database.
 */
const deleteBills = async () => {
  try {
    await Bill.deleteMany();
    console.log('Bills successfully deleted');
  } catch (error) {
    console.error('Error deleting Bills:', error);
  } finally {
    process.exit();
  }
};

// Switch based on command line arguments
const action = process.argv[2];
switch (action) {
  case '--import':
    importBills();
    break;
  case '--delete':
    deleteBills();
    break;
  default:
    console.error(
      'Invalid option. Use --import to import data or --delete to delete data.'
    );
    process.exit(1);
}
