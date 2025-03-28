"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Toast from "./Toast";

const requestResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type RequestResetFormData = z.infer<typeof requestResetSchema>;

export default function RequestResetForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestResetFormData>({
    resolver: zodResolver(requestResetSchema),
  });

  const onSubmit = async (data: RequestResetFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to request password reset");
      }

      setToast({
        message: result.message,
        type: "success",
      });

      // Redirect to change password form with token
      setTimeout(() => {
        const params = new URLSearchParams({
          token: result.token,
          email: result.email,
        });
        router.push(`/change-password?${params.toString()}`);
      }, 2000);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "An error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Reset Password</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-coral-500 text-white py-3 px-4 rounded-xl hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-300">
          Remember your password?{" "}
          <a href="/login" className="text-coral-500 hover:text-coral-400">
            Sign in
          </a>
        </p>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
} 