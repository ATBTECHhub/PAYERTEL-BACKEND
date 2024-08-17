import Bill from '../models/billModel.js';

export const fetchBillInfo = async (itemCode, billerCode, category) => {
  const billInfoQuery =
    category === 'electricity'
      ? {
          billerCode,
          category,
        }
      : {
          itemCode,
          billerCode,
          category,
        };

  const billInfo = await Bill.findOne(billInfoQuery);

  return billInfo;
};
