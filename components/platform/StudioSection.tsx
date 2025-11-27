"use client";

import { useState } from "react";
import {
  Video,
  PenTool,
  Search,
  Sparkles,
  Copy,
  Users,
  RefreshCw,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import { callGemini } from "../../lib/gemini";

export default function StudioSection() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTool, setActiveTool] = useState<"video" | "copy" | "audit">("video");
  const [generatedResult, setGeneratedResult] = useState("");

  const handleAIScriptWrite = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedResult("");

    const systemPrompt =
      "You are an expert video scriptwriter for a digital marketing agency. Write a short, punchy, high-energy 30-second video script for an AI avatar based on the user's topic. Format it with [Scene Start] and [Scene End].";
    const result = await callGemini(prompt, systemPrompt);

    setGeneratedResult(result);
    setPrompt(result);
    setIsGenerating(false);
  };

  const handleAIAdCopy = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedResult("");

    const systemPrompt =
      "You are a social media expert. Generate 3 distinct ad copy variations (Instagram, LinkedIn, Twitter) for the product/brand described. Include hashtags.";
    const result = await callGemini(prompt, systemPrompt);

    setGeneratedResult(result);
    setIsGenerating(false);
  };

  const handleAIAudit = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedResult("");

    const systemPrompt =
      "You are a senior digital strategist. Provide a bulleted 5-point strategic growth checklist for the brand name provided. Focus on quick wins and long term branding.";
    const result = await callGemini(prompt, systemPrompt);

    setGeneratedResult(result);
    setIsGenerating(false);
  };

  const renderToolInput = () => {
    if (activeTool === "video") {
      return (
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Topic: e.g. 'Year End Sale for Sneaker Shop' OR type full script..."
              className="w-full h-14 bg-gray-900 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors text-white placeholder-gray-600 resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAIScriptWrite()}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <Sparkles size={16} className="fill-white" />
              {isGenerating ? "Writing..." : "Auto-Write Script ✨"}
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50">
              <Video size={16} className="fill-white" /> Generate Video
            </button>
          </div>
        </div>
      );
    } else if (activeTool === "copy") {
      return (
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Product Name & Key Benefit (e.g. 'Rinads Academy - Learn while earning')"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
          />
          <button
            onClick={handleAIAdCopy}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <PenTool size={16} /> {isGenerating ? "Generating..." : "Generate Copy ✨"}
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter Brand Name for Strategy Audit"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 text-white"
          />
          <button
            onClick={handleAIAudit}
            disabled={isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Search size={16} /> {isGenerating ? "Auditing..." : "Run Strategy Audit ✨"}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800 pb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">
              Rinads{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
                AI Studio
              </span>
            </h2>
            <p className="text-gray-400">The ultimate toolkit for creators. Powered by Gemini LLM.</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <span className="px-3 py-1 bg-red-600/20 text-red-500 border border-red-600/30 rounded text-xs font-bold uppercase">
              Beta Access
            </span>
            <span className="px-3 py-1 bg-gray-800 text-gray-400 border border-gray-700 rounded text-xs">
              v2.1 AI-Integrated
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Workspace */}
          <div className="lg:col-span-8 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-1 overflow-hidden flex flex-col min-h-[600px]">
            {/* Toolbar */}
            <div className="bg-black border-b border-gray-800 p-3 flex gap-2 items-center">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-900 rounded-lg border border-gray-800 text-sm text-white capitalize">
                {activeTool === "video" && <Video size={14} />}
                {activeTool === "copy" && <PenTool size={14} />}
                {activeTool === "audit" && <Search size={14} />}
                {activeTool} Mode
              </div>
              <div className="w-px h-6 bg-gray-800 mx-1"></div>
              {activeTool === "video" && (
                <div className="text-gray-500 text-xs flex items-center">Resolution: 1080p</div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-900/50 relative flex flex-col p-8 overflow-y-auto">
              <div className="bg-black border border-gray-800 rounded-xl w-full h-full shadow-2xl relative overflow-hidden flex flex-col">
                {activeTool === "video" && generatedResult === "" && !isGenerating && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 p-8">
                    <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border border-gray-700">
                      <Users size={40} className="text-gray-500" />
                    </div>
                    <p className="text-gray-400">AI Avatar Preview</p>
                    <p className="text-xs text-gray-600 mt-1">Use &quot;Auto-Write&quot; to generate a script</p>
                  </div>
                )}

                {(activeTool === "copy" || activeTool === "audit") &&
                  generatedResult === "" &&
                  !isGenerating && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 p-8">
                      <Sparkles size={64} className="text-gray-700 mb-4" />
                      <p className="text-gray-400">AI Results Area</p>
                      <p className="text-xs text-gray-600 mt-1">Enter a prompt below to start magic</p>
                    </div>
                  )}

                {isGenerating && (
                  <div className="flex-1 flex flex-col items-center justify-center z-10">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white font-medium animate-pulse">Consulting Gemini AI...</p>
                  </div>
                )}

                {generatedResult && !isGenerating && (
                  <div className="flex-1 p-6 overflow-y-auto bg-gray-900/50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                        AI Generated Output
                      </h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedResult);
                        }}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap font-mono text-gray-300">
                      {generatedResult}
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_19px,#333_20px),linear-gradient(90deg,transparent_19px,#333_20px)] bg-[size:20px_20px] z-0"></div>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-black border-t border-gray-800 p-4 z-20">{renderToolInput()}</div>
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-4">
            <RevealOnScroll delay={100}>
              <div
                onClick={() => {
                  setActiveTool("video");
                  setPrompt("");
                  setGeneratedResult("");
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeTool === "video"
                    ? "bg-gray-900 border-red-600"
                    : "bg-black border-gray-800 hover:border-gray-600"
                }`}
              >
                <h3 className="text-lg font-bold mb-1 flex items-center text-white">
                  <Video
                    className={`mr-3 ${activeTool === "video" ? "text-red-500" : "text-gray-500"}`}
                    size={20}
                  />
                  AI Video Producer
                </h3>
                <p className="text-xs text-gray-500">Auto-write scripts & generate avatars.</p>
                {activeTool === "video" && (
                  <span className="mt-2 inline-flex items-center text-[10px] text-purple-400">
                    <Sparkles size={10} className="mr-1" /> Integrated with Gemini
                  </span>
                )}
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div
                onClick={() => {
                  setActiveTool("copy");
                  setPrompt("");
                  setGeneratedResult("");
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeTool === "copy"
                    ? "bg-gray-900 border-blue-600"
                    : "bg-black border-gray-800 hover:border-blue-500"
                }`}
              >
                <h3 className="text-lg font-bold mb-1 flex items-center text-white">
                  <PenTool
                    className={`mr-3 ${activeTool === "copy" ? "text-blue-500" : "text-gray-500"}`}
                    size={20}
                  />
                  AI Ad Copy Gen
                </h3>
                <p className="text-xs text-gray-500 mb-3">Instant captions for Insta & LinkedIn.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div
                onClick={() => {
                  setActiveTool("audit");
                  setPrompt("");
                  setGeneratedResult("");
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeTool === "audit"
                    ? "bg-gray-900 border-green-600"
                    : "bg-black border-gray-800 hover:border-green-500"
                }`}
              >
                <h3 className="text-lg font-bold mb-1 flex items-center text-white">
                  <Search
                    className={`mr-3 ${activeTool === "audit" ? "text-green-500" : "text-gray-500"}`}
                    size={20}
                  />
                  Strategic Audit
                </h3>
                <p className="text-xs text-gray-500 mb-3">AI analysis of your brand name strategy.</p>
              </div>
            </RevealOnScroll>

            <div className="mt-8 bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-300">Credits</span>
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                  Basic Plan
                </span>
              </div>
              <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-gray-800">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 w-[70%] h-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">7/10 AI Actions Remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

