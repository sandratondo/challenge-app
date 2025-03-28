import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '../../../../lib/db';
import * as z from 'zod';
import { Prisma } from '@prisma/client';
import { SECURITY, security } from '../../../../lib/security';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(SECURITY.PASSWORD.MIN_LENGTH, `Password must be at least ${SECURITY.PASSWORD.MIN_LENGTH} characters`)
    .max(SECURITY.PASSWORD.MAX_LENGTH, `Password must not exceed ${SECURITY.PASSWORD.MAX_LENGTH} characters`)
    .regex(SECURITY.PASSWORD.REGEX, SECURITY.PASSWORD.REGEX_MESSAGE),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    console.log('Request body:', body);

    // Validate the request body
    const { email, password, name } = userSchema.parse(body);

    // Sanitize inputs
    const sanitizedEmail = security.sanitizeInput(email);
    const sanitizedName = name ? security.sanitizeInput(name) : undefined;

    // Check if password is in common passwords list
    if (security.isCommonPassword(password)) {
      return NextResponse.json(
        { error: 'This password is too common. Please choose a stronger password.' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password with configured salt rounds
    const hashedPassword = await hash(password, SECURITY.PASSWORD.SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        name: sanitizedName,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    // Check for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 