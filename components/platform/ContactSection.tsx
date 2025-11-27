"use client";

import { useState } from "react";
import { Send, RefreshCw, Mail, Phone, MapPin } from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const subject = `New Inquiry from ${data.firstName} ${data.lastName}: ${data.interest}`;
    const body = `Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Interest: ${data.interest}

Message:
${data.message}`;

    const mailtoLink = `mailto:mail@rinads.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.location.href = mailtoLink;
      setFormStatus("success");
      setTimeout(() => {
        setFormStatus("idle");
        (e.target as HTMLFormElement).reset();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Let&apos;s <span className="text-red-600">Connect</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Ready to scale your brand? Tell us about your project and we&apos;ll get back to you
              within 24 hours.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <RevealOnScroll delay={100}>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                <p className="text-gray-400 mb-8">
                  Whether you&apos;re looking for agency services, academy courses, or want to join
                  our creator network, we&apos;re here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-600/30">
                    <Mail className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <a
                      href="mailto:mail@rinads.com"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      mail@rinads.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-600/30">
                    <Phone className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <a
                      href="tel:+911234567890"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      +91 123 456 7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-600/30">
                    <MapPin className="text-red-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Location</h4>
                    <p className="text-gray-400">Kerala, India</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Interest</label>
                <select
                  name="interest"
                  required
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                >
                  <option value="">Select an option</option>
                  <option value="Agency Services">Agency Services</option>
                  <option value="Academy Courses">Academy Courses</option>
                  <option value="Creator Network">Creator Network</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(220,20,60,0.3)]"
              >
                {formStatus === "sending" ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={20} /> Sending...
                  </>
                ) : formStatus === "success" ? (
                  "Message Sent! ✓"
                ) : (
                  <>
                    <Send className="mr-2" size={20} /> Send Message
                  </>
                )}
              </button>
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
}

