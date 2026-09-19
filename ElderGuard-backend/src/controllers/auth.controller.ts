import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { signToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * AUTHENTICATION CONTROLLER
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

    // 5. Check if user already exists in the database
    const [existingUsers]: any = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({
        message: 'An account with this email address already exists.',
        status: 'error'
      });
      return;
    }

    // 6. Hash password using bcrypt (Cost factor / salt rounds: 10)
    // NEVER save plain text passwords in the database!
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Insert the new user into the database
    const [result]: any = await pool.query(
      `INSERT INTO users (full_name, email, phone_number, password, role, status) 
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [fullName.trim(), email.toLowerCase().trim(), phoneNumber.trim(), hashedPassword, normalizedRole]
    );

    const newUserId = result.insertId;

    // 8. Generate a JWT token for the newly registered user
    const token = signToken({
      userId: newUserId,
      email: email.toLowerCase().trim(),
      role: normalizedRole
    });

    res.status(201).json({
      message: 'User registered successfully',
      status: 'success',
      token,
      user: {
        user_id: newUserId,
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone_number: phoneNumber.trim(),
        role: normalizedRole,
        status: 'active'
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

    // 1. Fetch user from MySQL by email
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      res.status(401).json({
        message: 'Invalid email or password.',
        status: 'error'
      });
      return;
    }

    const user = users[0];

    // 2. Compare provided password with hashed password in database
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
      role: user.role
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
        status: user.status || 'active'
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

    const [admins]: any = await pool.query(
      'SELECT * FROM admins WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (admins.length === 0) {
      res.status(401).json({
        message: 'Invalid admin credentials.',
        status: 'error'
      });
      return;
    }

    const admin = admins[0];
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      res.status(401).json({
        message: 'Invalid admin credentials.',
        status: 'error'
      });
      return;
    }

    const token = signToken({
      userId: admin.admin_id,
      email: admin.email,
      role: 'admin'
    });

    res.status(200).json({
      message: 'Admin login successful',
      status: 'success',
      token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
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
      const [admins]: any = await pool.query(
        'SELECT admin_id, name, email, created_at FROM admins WHERE admin_id = ?',
        [req.user.userId]
      );
      if (admins.length === 0) {
        res.status(404).json({ message: 'Admin not found', status: 'error' });
        return;
      }
      res.status(200).json({
        status: 'success',
        data: { ...admins[0], role: 'admin' }
      });
      return;
    }

    const [users]: any = await pool.query(
      'SELECT user_id, full_name, email, phone_number, role, status, created_at FROM users WHERE user_id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      res.status(404).json({ message: 'User not found', status: 'error' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: users[0]
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      message: 'Internal server error fetching profile.',
      status: 'error'
    });
  }
}
