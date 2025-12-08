"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate authentication (replace with real API call)
    setTimeout(() => {
      if (email && password) {
        // Store auth state (in real app, use proper auth system)
        localStorage.setItem("rinads-auth", "true");
        localStorage.setItem("rinads-user", email);
        router.push("/");
      } else {
        setError("Please enter both email and password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-12 z-10">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <span className="text-white font-bold text-4xl">R</span>
        </div>
        <h1 className="text-white font-bold text-5xl md:text-6xl mb-2 tracking-tight">
          RINADS
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-1">Business Operating System</p>
        <p className="text-white/70 text-sm md:text-base">All-in-One Platform for Your Business</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md px-6 z-10">
        <div className="bg-white rounded-t-3xl rounded-b-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign In</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-red-600 hover:text-red-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Support Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 z-20">
        <MessageCircle className="text-white" size={24} />
      </button>

      {/* Footer */}
      <div className="mt-8 text-center z-10">
        <p className="text-white/60 text-sm">
          © 2024 RINADS BusinessOS. All rights reserved.
        </p>
      </div>
    </div>
  );
}



