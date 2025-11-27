"use client";

import { useState } from "react";
import { User, Lock, RefreshCw } from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";

interface LoginSectionProps {
  setActiveTab: (tab: string) => void;
}

export default function LoginSection({ setActiveTab }: LoginSectionProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Successfully logged in as ${email}! Welcome back.`);
      setActiveTab("agency");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <RevealOnScroll>
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 mb-6 shadow-lg group">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(220,20,60,0.5)]">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">Welcome Back</h2>
              <p className="text-gray-400 text-sm">
                Enter your credentials to access your workspace.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <User size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <Lock size={12} /> Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:text-red-400 transition-colors font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-white focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-lg bg-white text-black hover:bg-gray-200 transition-all transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={18} /> Signing
                    in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => {
                    setActiveTab("contact");
                    window.scrollTo(0, 0);
                  }}
                  className="text-white font-bold hover:text-red-500 transition-colors"
                >
                  Get Started
                </button>
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}

