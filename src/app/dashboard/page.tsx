"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";

interface User {
  id: string;
  email: string;
  name: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have user data in localStorage
        const userData = localStorage.getItem("user");
        if (!userData) {
          window.location.href = "/login";
          return;
        }

        // Then verify the token
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", // Important: include cookies
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("user");
        window.location.href = "/login";
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important: include cookies
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear user data from localStorage
      localStorage.removeItem("user");
      
      showToast("Logged out successfully", "success");
      
      // Force a hard redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Failed to logout", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-coral-500 text-white px-4 py-2 rounded-lg hover:bg-coral-600 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>
      <main className="container mx-auto p-8">
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          <p className="text-gray-300">You are logged in as {user.email}</p>
        </div>
      </main>
    </div>
  );
} 