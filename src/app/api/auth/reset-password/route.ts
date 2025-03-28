import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import * as z from "zod";

const resetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

interface ResetTokenResult {
  id: string;
  email: string;
  tokenId: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { token, email, password } = resetPasswordSchema.parse(body);
    console.log("Parsed request data:", { token, email, password: "***" });

    // First, check if the token exists and is valid
    const validToken = await prisma.$queryRaw`
      SELECT rt.*, u.email
      FROM PasswordResetToken rt
      JOIN User u ON rt.userId = u.id
      WHERE rt.token = ${token}
      AND rt.used = false
      AND rt.expiresAt > NOW()
    `;
    console.log("Valid token check:", validToken);

    if (!validToken || (validToken as any[]).length === 0) {
      // Check if token is expired
      const expiredToken = await prisma.$queryRaw`
        SELECT rt.*, u.email
        FROM PasswordResetToken rt
        JOIN User u ON rt.userId = u.id
        WHERE rt.token = ${token}
        AND rt.expiresAt <= NOW()
      `;
      console.log("Expired token check:", expiredToken);

      if (expiredToken && (expiredToken as any[]).length > 0) {
        return NextResponse.json(
          { message: "Token has expired" },
          { status: 400 }
        );
      }

      // Check if token is used
      const usedToken = await prisma.$queryRaw`
        SELECT rt.*, u.email
        FROM PasswordResetToken rt
        JOIN User u ON rt.userId = u.id
        WHERE rt.token = ${token}
        AND rt.used = true
      `;
      console.log("Used token check:", usedToken);

      if (usedToken && (usedToken as any[]).length > 0) {
        return NextResponse.json(
          { message: "Token has already been used" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Invalid reset token" },
        { status: 400 }
      );
    }

    const tokenData = (validToken as any[])[0];

    // Verify the email matches
    if (tokenData.email !== email) {
      return NextResponse.json(
        { message: "Token does not match the provided email" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(password, 12);

    // Update user password and mark token as used in a transaction
    await prisma.$transaction([
      prisma.$executeRaw`
        UPDATE User
        SET password = ${hashedPassword}
        WHERE id = ${tokenData.userId}
      `,
      prisma.$executeRaw`
        UPDATE PasswordResetToken
        SET used = true
        WHERE id = ${tokenData.id}
      `,
    ]);

    console.log("Password updated successfully");

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
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