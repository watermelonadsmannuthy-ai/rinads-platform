// Visitor Demo Interface
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, Calendar, Zap, ArrowRight } from 'lucide-react';

export default function DemoPage() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSendMessage() {
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage;
    setChatMessage('');
    setLoading(true);

    // Add user message to history
    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);

    try {
      // Use demo tenant ID or create a demo session
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'demo', // Demo tenant
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      setChatHistory([...newHistory, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory([
        ...newHistory,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">RINADS Platform</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Try RINADS Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience our ERP + Agency Automation Suite with AI-powered tools
          </p>
        </div>

        {/* Demo Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <Sparkles className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600">
              Chat with our AI assistant to get insights, generate content, and automate workflows
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Calendar className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Content Calendar</h3>
            <p className="text-gray-600">
              Schedule and manage your social media content with AI-powered caption generation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Zap className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Automation</h3>
            <p className="text-gray-600">
              Automate task allocation, content scheduling, and workflow management
            </p>
          </div>
        </div>

        {/* AI Chatbot Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">Try AI Assistant</h2>
          </div>

          {/* Chat History */}
          <div className="border rounded-lg p-4 mb-4 h-64 overflow-y-auto bg-gray-50">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Start a conversation with our AI assistant</p>
                <p className="text-sm mt-2">Try: "What can you help me with?"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg p-3">
                      <p className="text-sm text-gray-500">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about RINADS..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !chatMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Sign up for a free trial and experience the full power of RINADS
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features List */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">For Agencies</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Task automation and allocation</li>
              <li>✓ Client portal and project management</li>
              <li>✓ Content calendar with AI captions</li>
              <li>✓ Invoice generation and tracking</li>
              <li>✓ Lead management with AI qualification</li>
              <li>✓ QR-based attendance tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Project visibility and updates</li>
              <li>✓ Invoice and payment tracking</li>
              <li>✓ Content calendar preview</li>
              <li>✓ Direct messaging with team</li>
              <li>✓ File upload and sharing</li>
              <li>✓ Real-time notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

