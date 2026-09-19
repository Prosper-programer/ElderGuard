import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthTokenPayload, UserRole } from '../types';

/**
 * AuthenticatedRequest interface extends standard Express Request
 * so that TypeScript knows req.user exists on authenticated routes.
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

import pool from '../config/database';

/**
 * AUTHENTICATION MIDDLEWARE
 * What it does:
 * 1. Checks if the HTTP request includes an "Authorization: Bearer <token>" header.
 * 2. Verifies the token's validity using our JWT secret key.
 * 3. Immediately checks user's active status in the database to reject deactivated sessions.
 * 4. Extracts the user's id, email, and role from the token and attaches it to req.user.
 * 5. If invalid, deactivated, or missing, immediately stops the request.
 */
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Access denied. No authentication token provided.',
      status: 'error'
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    // If token belongs to an admin, verify against admins table
    if (decoded.role === 'admin') {
      const [admins]: any = await pool.query(
        'SELECT admin_id FROM admins WHERE admin_id = ?',
        [decoded.userId]
      );
      if (admins.length === 0) {
        res.status(401).json({
          message: 'Admin account not found or access revoked.',
          status: 'error'
        });
        return;
      }
    } else {
      // For platform users (parents, caregivers, doctors), verify account status in DB
      const [users]: any = await pool.query(
        'SELECT status FROM users WHERE user_id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        res.status(401).json({
          message: 'User account not found.',
          status: 'error'
        });
        return;
      }

      if (users[0].status !== 'active') {
        // Allow read-only GET requests so the mobile app can load and show deactivation status on the home page.
        // Restrict write/mutation operations (POST, PUT, DELETE).
        if (req.method !== 'GET') {
          res.status(403).json({
            message: 'Account has been deactivated by an administrator. Mutating actions and services are suspended.',
            status: 'error'
          });
          return;
        }
      }
    }

    req.user = decoded;
    next(); // Token is valid and account is active, proceed!
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired authentication token.',
      status: 'error'
    });
  }
}

/**
 * ROLE-BASED AUTHORIZATION MIDDLEWARE
 * What it does:
 * Checks whether the authenticated user has one of the required roles (e.g. 'parent', 'caregiver', 'admin').
 * If not, returns HTTP 403 Forbidden.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: 'Authentication required.',
        status: 'error'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource.`,
        status: 'error'
      });
      return;
    }

    next(); // User has permission, proceed!
  };
}
