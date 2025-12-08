"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate password reset (replace with real API call)
    setTimeout(() => {
      setSubmitted(true);
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
      <div className="text-center mb-8 z-10">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-white font-bold text-4xl">R</span>
        </div>
        <h1 className="text-white font-bold text-5xl md:text-6xl mb-2 tracking-tight">
          RINADS
        </h1>
        <p className="text-white/90 text-lg md:text-xl">Reset Your Password</p>
      </div>

      {/* Reset Card */}
      <div className="w-full max-w-md px-6 z-10">
        <div className="bg-white rounded-t-3xl rounded-b-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-10">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password?</h2>
                <p className="text-gray-600 mb-8">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Support Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 z-20">
        <MessageCircle className="text-white" size={24} />
      </button>
    </div>
  );
}



