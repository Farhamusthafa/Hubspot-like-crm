import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { dataSafetyMiddleware, sanitizeData } from '../middleware/dataSafety.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Apply data safety middleware to modifying operations
router.use(['post', 'put', 'patch', 'delete'], dataSafetyMiddleware);
router.use(['post', 'put', 'patch'], sanitizeData);

// GET /api/users - Get all users
router.get('/', UserController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// POST /api/users - Create user
router.post('/', UserController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', UserController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

// PATCH /api/users/:id/toggle-status - Toggle user status
router.patch('/:id/toggle-status', UserController.toggleUserStatus);

// Data Safety Endpoints

// GET /api/users/integrity-check - Check data integrity
router.get('/admin/integrity-check', UserController.dataIntegrityCheck);

// GET /api/users/report - Generate data report
router.get('/admin/report', UserController.generateDataReport);

// POST /api/users/backup - Create backup
router.post('/admin/backup', UserController.createBackup);

// GET /api/users/backups - List backups
router.get('/admin/backups', UserController.listBackups);

export default router;
