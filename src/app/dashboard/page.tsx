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
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      try {
        const userStr = localStorage.getItem("user");
        console.log("User data from localStorage:", userStr);
        
        if (!userStr) {
          console.log("No user data found");
          setUser(null);
          return;
        }

        const userData = JSON.parse(userStr);
        console.log("Parsed user data:", userData);
        setUser(userData);
      } catch (error) {
        console.error("Error checking user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear localStorage
      localStorage.clear();
      
      // Show success message
      showToast("Logged out successfully!", "success");
      
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Error during logout", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-coral-500 text-white px-4 py-2 rounded-lg hover:bg-coral-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Welcome, {user.name || user.email}!</h2>
          <p className="text-gray-300">
            You are successfully logged in. This is your dashboard.
          </p>
        </div>
      </main>
    </div>
  );
} 