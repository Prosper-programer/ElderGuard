import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User, Admin } from '../models';
import { signToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * AUTHENTICATION CONTROLLER (Sequelize ORM)
 * 
 * Handles registration, login, logout, and profile retrieval for:
 * - Parents
 * - Caregivers
 * - Admins
 */

/**
 * POST /api/auth/register
 * Allows Parents and Caregivers to create an account.
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    // 1. Validate required fields
    if (!fullName || !email || !phoneNumber || !password || !role) {
      res.status(400).json({
        message: 'All fields are required: fullName, email, phoneNumber, password, role.',
        status: 'error'
      });
      return;
    }

    // 2. Validate role: only 'parent' or 'caregiver' can register publicly
    const normalizedRole = role.toLowerCase();
    if (normalizedRole !== 'parent' && normalizedRole !== 'caregiver') {
      res.status(400).json({
        message: 'Invalid role. Public registration only allows "parent" or "caregiver". Admin accounts cannot be registered publicly.',
        status: 'error'
      });
      return;
    }

    // 3. Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: 'Invalid email address format.',
        status: 'error'
      });
      return;
    }

    // 4. Validate password length (minimum 6 characters)
    if (password.length < 6) {
      res.status(400).json({
        message: 'Password must be at least 6 characters long.',
        status: 'error'
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 5. Check if user already exists using Sequelize
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
      res.status(400).json({
        message: 'An account with this email address already exists.',
        status: 'error'
      });
      return;
    }

    // 6. Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Insert new user via Sequelize
    const newUser = await User.create({
      full_name: fullName.trim(),
      email: normalizedEmail,
      phone_number: phoneNumber.trim(),
      password: hashedPassword,
      role: normalizedRole,
      status: 'active',
    });

    // 8. Generate JWT token
    const token = signToken({
      userId: newUser.user_id,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      status: 'success',
      token,
      user: {
        user_id: newUser.user_id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        role: newUser.role,
        status: newUser.status,
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error during registration.',
      status: 'error'
    });
  }
}

/**
 * POST /api/auth/login
 * Authenticates Parents and Caregivers.
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Email and password are required.',
        status: 'error'
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fetch user via Sequelize
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password.',
        status: 'error'
      });
      return;
    }

    // 2. Compare provided password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        message: 'Invalid email or password.',
        status: 'error'
      });
      return;
    }

    // 3. Generate JWT token
    const token = signToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: user.status === 'active' ? 'Login successful' : 'Account is currently inactive',
      status: 'success',
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        status: user.status || 'active',
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error during login.',
      status: 'error'
    });
  }
}

/**
 * POST /api/auth/admin-login
 * Dedicated login for System Administrators.
 */
export async function adminLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Admin email and password are required.',
        status: 'error'
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fetch admin via Sequelize
    const admin = await Admin.findOne({ where: { email: normalizedEmail } });

    if (!admin) {
      res.status(401).json({
        message: 'Invalid admin credentials.',
        status: 'error'
      });
      return;
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        message: 'Invalid admin credentials.',
        status: 'error'
      });
      return;
    }

    // 3. Generate JWT token
    const token = signToken({
      userId: admin.admin_id,
      email: admin.email,
      role: 'admin',
    });

    res.status(200).json({
      message: 'Admin login successful',
      status: 'success',
      token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
      }
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({
      message: 'Internal server error during admin login.',
      status: 'error'
    });
  }
}

/**
 * POST /api/auth/logout
 * Stateless logout response.
 */
export function logout(req: Request, res: Response): void {
  res.status(200).json({
    message: 'User logged out successfully. Please remove token on client.',
    status: 'success'
  });
}

/**
 * GET /api/auth/profile
 * Retrieves the profile of the currently logged-in user using the JWT token.
 */
export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Not authenticated.',
        status: 'error'
      });
      return;
    }

    if (req.user.role === 'admin') {
      const admin = await Admin.findByPk(req.user.userId, {
        attributes: ['admin_id', 'name', 'email', 'created_at'],
      });

      if (!admin) {
        res.status(404).json({ message: 'Admin not found', status: 'error' });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: {
          admin_id: admin.admin_id,
          name: admin.name,
          email: admin.email,
          role: 'admin',
          created_at: admin.created_at,
        }
      });
      return;
    }

    const user = await User.findByPk(req.user.userId, {
      attributes: ['user_id', 'full_name', 'email', 'phone_number', 'role', 'status', 'created_at'],
    });

    if (!user) {
      res.status(404).json({ message: 'User not found', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      message: 'Internal server error fetching profile.',
      status: 'error'
    });
  }
}
