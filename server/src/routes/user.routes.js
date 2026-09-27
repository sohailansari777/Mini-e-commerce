import express from 'express';
import {
  UserRegister,
  UserLogin,
  RefreshToken,
  UserLogout,
  GetMe,
  UpdateProfile,
  ChangePassword,
  DeleteAccount
} from '../controller/user.controller.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator
} from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, UserRegister);
router.post('/login', loginValidator, validateRequest, UserLogin);
router.post('/refresh-token', RefreshToken);
router.post('/logout', UserLogout);

router.get('/me', authenticate, GetMe);
router.put('/me', authenticate, updateProfileValidator, validateRequest, UpdateProfile);
router.put('/me/password', authenticate, changePasswordValidator, validateRequest, ChangePassword);
router.delete('/me', authenticate, DeleteAccount);

export default router;