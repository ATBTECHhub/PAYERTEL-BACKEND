import express from 'express';
import {superAdminAuth} from '../middleware/adminAuth.js';
import {
    createSuperAdmin,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
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
    generateSystemReport
} from '../controllers/superAdminController.js';


const router = express.Router();


router.get("super-admin", createSuperAdmin);
router.get('/users', superAdminAuth, getAllUsers);
router.get('/users/:id', superAdminAuth, getUserById);
router.post('/users', superAdminAuth, createUser);
router.put('/users/:id', superAdminAuth, updateUser);
router.delete('/users/:id', superAdminAuth, deleteUser);
router.get('/system/performance', superAdminAuth, viewSystemPerformance);
router.get('/system/errors', superAdminAuth, viewErrorLogs);
router.post('/system/maintenance', superAdminAuth, runSystemMaintenance);
router.post('/roles', superAdminAuth, createRole);
router.put('/roles/:id', superAdminAuth, updateRolePermissions);
router.delete('/roles/:id', superAdminAuth, deleteRole);
router.get('/security/access-logs', superAdminAuth, viewAccessLogs);
router.post('/security/alerts', superAdminAuth, manageSecurityAlerts);
router.put('/security/roles/:id', superAdminAuth, manageAdminRoles);
router.get('/transactions', superAdminAuth, viewAllTransactions);
router.post('/transactions/approve', superAdminAuth, approveOrFlagTransaction);
router.post('/transactions/refund', superAdminAuth, processRefund);
router.get('/reports/financial', superAdminAuth, generateFinancialReport);
router.get('/reports/system', superAdminAuth, generateSystemReport);

export default router;
