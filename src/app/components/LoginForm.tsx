"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Attempting login with:', data.email);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log('Login response status:', response.status);

      const result = await response.json();
      console.log('Login response data:', result);

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(result.user));

      console.log('User data stored in localStorage');

      // Redirect to dashboard or home page
      console.log('Attempting to redirect to dashboard...');
      window.location.href = '/dashboard';
      console.log('Redirect command executed');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Sign in</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-coral-500 text-white py-3 px-4 rounded-xl hover:bg-coral-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Don't have an account?{" "}
          <a href="/register" className="text-coral-500 hover:text-coral-400">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
