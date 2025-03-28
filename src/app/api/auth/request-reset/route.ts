import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import * as z from "zod";

const requestResetSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = requestResetSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, a reset link will be sent." },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex");
    const tokenId = randomBytes(16).toString("hex");

    console.log("Creating reset token:", {
      tokenId,
      token,
      userId: user.id,
    });

    // Create reset token using MySQL's DATE_ADD function
    const resetToken = await prisma.$executeRaw`
      INSERT INTO PasswordResetToken (id, token, userId, createdAt, expiresAt, used)
      VALUES (
        ${tokenId},
        ${token},
        ${user.id},
        NOW(),
        DATE_ADD(NOW(), INTERVAL 1 HOUR),
        false
      )
    `;

    console.log("Reset token created:", resetToken);

    // In a real application, you would send an email here with the reset link
    // For development purposes, we'll just return the token
    return NextResponse.json({
      message: "Password reset link sent to your email.",
      token,
      email: user.email,
    });
  } catch (error) {
    console.error("Request reset error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 