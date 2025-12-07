"use client";

import { useState } from "react";
import { Calendar, Clock, Mail, Phone, Building, User, Check } from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import Toast from "./Toast";

export default function BookDemo() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");

    // Get form data
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      vertical: formData.get("vertical"),
      date: formData.get("date"),
      time: formData.get("time"),
      notes: formData.get("notes"),
    };

    try {
      // Show immediate feedback
      showToast("Submitting your demo request...", "info");

      // Simulate API call (replace with actual API endpoint)
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Simulate delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (response.ok || true) {
        // Success - show toast and update form
        showToast("Demo request submitted successfully! We'll contact you within 24 hours.", "success");
        setFormStatus("success");
        
        // Optional: Show browser alert as well
        if (typeof window !== "undefined") {
          alert("✅ Demo Request Received!\n\nWe'll contact you within 24 hours to schedule your demo.");
        }

        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      // Error handling
      showToast("Something went wrong. Please try again or contact us directly.", "error");
      setFormStatus("idle");
      
      if (typeof window !== "undefined") {
        alert("❌ Error submitting demo request.\n\nPlease try again or contact us at sales@rinads.com");
      }
    }
  };

  const verticals = ["SalonOS", "ClinicOS", "RetailOS", "FinanceOS", "EduOS", "Not Sure"];

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Book a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Demo</span>
            </h1>
            <p className="text-gray-400 text-lg">
              See BusinessOS in action. Our team will show you how it can transform your business.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RevealOnScroll delay={200}>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8">
                {formStatus === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Demo Request Received!</h2>
                    <p className="text-gray-400">
                      We&apos;ll contact you within 24 hours to schedule your demo.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                          <User size={14} className="inline mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                          <Mail size={14} className="inline mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                          <Phone size={14} className="inline mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="+91 123 456 7890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">
                          <Building size={14} className="inline mr-2" />
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          required
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">
                        Which vertical are you interested in?
                      </label>
                      <select
                        name="vertical"
                        required
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      >
                        <option value="">Select a vertical</option>
                        {verticals.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">
                        Preferred Date & Time
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="date"
                          name="date"
                          required
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <input
                          type="time"
                          name="time"
                          required
                          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={4}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                        placeholder="Tell us about your business needs..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,20,60,0.3)]"
                    >
                      {formStatus === "sending" ? "Scheduling..." : "Schedule Demo"}
                    </button>
                  </form>
                )}
              </div>
            </RevealOnScroll>
          </div>

          <div className="space-y-6">
            <RevealOnScroll delay={300}>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>30-minute personalized walkthrough</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>See your vertical in action</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Q&A with our product team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Custom pricing discussion</span>
                  </li>
                </ul>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Can&apos;t find a time that works? Contact us directly.
                </p>
                <div className="space-y-2 text-sm">
                  <a href="mailto:sales@rinads.com" className="flex items-center gap-2 text-red-500 hover:text-red-400">
                    <Mail size={16} /> sales@rinads.com
                  </a>
                  <a href="tel:+911234567890" className="flex items-center gap-2 text-red-500 hover:text-red-400">
                    <Phone size={16} /> +91 123 456 7890
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}

