import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, phone, district, sector, address, password } = await request.json();

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      name,
      email,
      phone,
      district,
      sector,
      address,
      password: hashedPassword,
      role: 'customer' as const,
    };

    const result = await createUser(userData);

    // Get the created user without password
    const newUser = await getUserByEmail(email);
    if (!newUser) {
      throw new Error('Failed to create user');
    }

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}