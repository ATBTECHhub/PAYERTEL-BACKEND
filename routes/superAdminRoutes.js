import express from 'express';
// import { superAdminAuth } from '../middleware/adminAuth.js';
import {
  //   createSuperAdmin,
  //   getAllUsers,
  //   getUserById,
  //   createUser,
  //   updateUser,
  //   deleteUser,
  createRole,
  updateRolePermissions,
  deleteRole,
  viewSystemPerformance,
  viewErrorLogs,
  runSystemMaintenance,
  viewAccessLogs,
  manageSecurityAlerts,
  manageAdminRoles,
  viewAllTransactions,
  approveOrFlagTransaction,
  processRefund,
  generateFinancialReport,
  generateSystemReport,
} from '../controllers/superAdminController.js';
import { restrictTo } from '../middleware/protect.js';

const router = express.Router();

router.use(process, restrictTo('SuperAdmin'));

router.get('/system/performance', viewSystemPerformance);
router.get('/system/errors', viewErrorLogs);
router.post('/system/maintenance', runSystemMaintenance);
router.post('/roles', createRole);
router.route('/roles/:id').patch(updateRolePermissions).delete(deleteRole);
// router.put('/roles/:id', updateRolePermissions);
// router.delete('/roles/:id', deleteRole);
router.get('/security/access-logs', viewAccessLogs);
router.post('/security/alerts', manageSecurityAlerts);
router.put('/security/roles/:id', manageAdminRoles);
router.get('/transactions', viewAllTransactions);
router.post('/transactions/approve', approveOrFlagTransaction);
router.post('/transactions/refund', processRefund);
router.get('/reports/financial', generateFinancialReport);
router.get('/reports/system', generateSystemReport);

// router.post('/', createSuperAdmin);
// router.get('/users', superAdminAuth, getAllUsers);
// router.get('/users/:id', superAdminAuth, getUserById);
// router.post('/users', superAdminAuth, createUser);
// router.put('/users/:id', superAdminAuth, updateUser);
// router.delete('/users/:id', superAdminAuth, deleteUser);
// router.get('/system/performance', superAdminAuth, viewSystemPerformance);
// router.get('/system/errors', superAdminAuth, viewErrorLogs);
// router.post('/system/maintenance', superAdminAuth, runSystemMaintenance);
// router.post('/roles', superAdminAuth, createRole);
// router.put('/roles/:id', superAdminAuth, updateRolePermissions);
// router.delete('/roles/:id', superAdminAuth, deleteRole);
// router.get('/security/access-logs', superAdminAuth, viewAccessLogs);
// router.post('/security/alerts', superAdminAuth, manageSecurityAlerts);
// router.put('/security/roles/:id', superAdminAuth, manageAdminRoles);
// router.get('/transactions', superAdminAuth, viewAllTransactions);
// router.post('/transactions/approve', superAdminAuth, approveOrFlagTransaction);
// router.post('/transactions/refund', superAdminAuth, processRefund);
// router.get('/reports/financial', superAdminAuth, generateFinancialReport);
// router.get('/reports/system', superAdminAuth, generateSystemReport);

export default router;
