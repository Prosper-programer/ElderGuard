import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { signToken } from '../utils/jwt';
import { UserResponse } from '../types';

export class AuthService {
  public static async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'parent' | 'caregiver' | 'admin';
    phone?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: data.role,
        phone: data.phone,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: this.formatUser(user),
    };
  }

  public static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        managedElderly: true,
        caregivingElderly: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const assignedCount = user.role === 'parent' 
      ? user.managedElderly.length 
      : user.caregivingElderly.length;

    return {
      token,
      user: {
        ...this.formatUser(user),
        assignedElderlyCount: assignedCount,
      },
    };
  }

  public static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        managedElderly: true,
        caregivingElderly: true,
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const assignedCount = user.role === 'parent' 
      ? user.managedElderly.length 
      : user.caregivingElderly.length;

    return {
      ...this.formatUser(user),
      assignedElderlyCount: assignedCount,
    };
  }

  private static formatUser(user: any): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
