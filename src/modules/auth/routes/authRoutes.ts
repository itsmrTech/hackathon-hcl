import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateLogin } from '../validators/authValidators';

const router = Router();

// Login route
router.post('/login', validateLogin, AuthController.login);

// Logout route
router.post('/logout', AuthController.logout);

export default router; 