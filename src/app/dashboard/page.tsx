"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear the token cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      // Clear local storage
      localStorage.removeItem("user");
      showToast("Logged out successfully", "success");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Error logging out", "error");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome, {user.name || user.email}!
            </h2>
            <p className="text-gray-300">
              You are logged in with: {user.email}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 