import userModel from '../module/userSchema.module.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyRefreshToken } from '../util/auth.js';

// POST /api/auth/register
export const UserRegister = async (req, res) => {
  try {
    const { name, fullName, email, password } = req.body;
    const userName = name || fullName;

    const userExist = await userModel.findOne({ email: email.toLowerCase() });

    if (userExist) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        errors: [
          {
            field: 'email',
            message: 'Email already registered'
          }
        ]
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name: userName,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please login.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Registration failed: ${err.message}`
    });
  }
};

// POST /api/auth/login
export const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const { accessToken, refreshToken } = generateToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Login failed: ${err.message}`
    });
  }
};

// POST /api/auth/refresh-token
export const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is missing'
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const user = await userModel.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token revoked or invalid'
      });
    }

    const tokens = generateToken({ userId: user._id });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.status(200).json({
      success: true,
      accessToken: tokens.accessToken
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Token refresh failed: ${err.message}`
    });
  }
};

// POST /api/auth/logout
export const UserLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const user = await userModel.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    } else if (req.user) {
      const user = await userModel.findById(req.user._id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Logout failed: ${err.message}`
    });
  }
};

// GET /api/auth/me
export const GetMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to fetch profile: ${err.message}`
    });
  }
};

// PUT /api/auth/me
export const UpdateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const currentUserId = req.user._id;

    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await userModel.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== currentUserId.toString()) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use',
          errors: [
            {
              field: 'email',
              message: 'Email is already taken by another account'
            }
          ]
        });
      }
    }

    const user = await userModel.findById(currentUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Profile update failed: ${err.message}`
    });
  }
};

// PUT /api/auth/me/password
export const ChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        errors: [
          {
            field: 'currentPassword',
            message: 'Current password is incorrect'
          }
        ]
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Password change failed: ${err.message}`
    });
  }
};

// DELETE /api/auth/me
export const DeleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await userModel.findByIdAndDelete(userId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });

    return res.status(200).json({
      success: true,
      message: 'Account permanently deleted'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Account deletion failed: ${err.message}`
    });
  }
};

export default {
  UserRegister,
  UserLogin,
  RefreshToken,
  UserLogout,
  GetMe,
  UpdateProfile,
  ChangePassword,
  DeleteAccount
};
