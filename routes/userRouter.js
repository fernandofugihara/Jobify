import { Router } from 'express';
const router = Router();

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from '../controllers/userController.js';

// ================================================= Validate Update User Input Middleware  ===================================//
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
// =========================================================================================================================== //


// ================================================= AUTH middleware permition ================================================//
import { authorizePermitions} from '../middleware/authMiddleware.js';
// =========================================================================================================================== //

import upload from '../middleware/multerMiddleware.js';

import { checkForTestUser } from '../middleware/authMiddleware.js';


router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', authorizePermitions("admin") ,getApplicationStats);
router.patch('/update-user',checkForTestUser ,upload.single("avatar"), validateUpdateUserInput, updateUser);

export default router;