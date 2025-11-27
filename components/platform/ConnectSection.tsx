"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Globe,
  RefreshCw,
  Instagram,
  Twitter,
  Linkedin,
  Briefcase,
  MapPin,
} from "lucide-react";
import RevealOnScroll from "../RevealOnScroll";
import { callGemini } from "../../lib/gemini";

interface Influencer {
  name: string;
  niche: string;
  followers: string;
  rate: string;
  tags: string[];
  image: string;
  location: string;
}

const initialInfluencers: Influencer[] = [
  {
    name: "Sarah Jenkins",
    niche: "Tech & Gadgets",
    followers: "1.2M",
    rate: "₹50k/post",
    tags: ["Reviews", "Unboxing"],
    image: "bg-blue-600",
    location: "Bangalore",
  },
  {
    name: "Rohan Das",
    niche: "Lifestyle & Travel",
    followers: "500k",
    rate: "₹35k/post",
    tags: ["Vlog", "Fashion"],
    image: "bg-green-600",
    location: "Mumbai",
  },
  {
    name: "TechMalayalam",
    niche: "Tech (Regional)",
    followers: "850k",
    rate: "₹45k/post",
    tags: ["Malayalam", "Tech"],
    image: "bg-purple-600",
    location: "Thrissur",
  },
  {
    name: "Anjali Foods",
    niche: "Food & Cooking",
    followers: "2.1M",
    rate: "₹80k/post",
    tags: ["Recipes", "Promos"],
    image: "bg-orange-600",
    location: "Kochi",
  },
  {
    name: "FitnessFreak",
    niche: "Health & Fitness",
    followers: "300k",
    rate: "₹25k/post",
    tags: ["Gym", "Diet"],
    image: "bg-red-600",
    location: "Delhi",
  },
  {
    name: "PixelArt",
    niche: "Design & Art",
    followers: "150k",
    rate: "₹15k/post",
    tags: ["Tutorials", "Creative"],
    image: "bg-pink-600",
    location: "Chennai",
  },
];

export default function ConnectSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers);

  const niches = ["All", "Tech", "Lifestyle", "Food", "Health", "Design"];

  const handleRealTimeSearch = async () => {
    if (!searchTerm) return;
    setIsSearchingAI(true);

    const systemPrompt = `You are an influencer discovery engine. 
    Perform a Google Search using specific operators like 'site:instagram.com' or 'site:youtube.com' combined with the user's location and niche keywords to find real public profiles.
    Extract the Name, approximate Follower count (if visible in snippets), and Location.
    Return a strictly formatted JSON array of 6 objects. 
    Format: [{"name": "Name", "niche": "Niche", "followers": "Count", "rate": "Est. Cost", "tags": ["Tag1", "Tag2"], "location": "City", "image": "bg-gradient-to-br from-gray-800 to-gray-900"}]
    Do not include markdown formatting like \`\`\`json. Return ONLY the raw JSON string.`;

    const prompt = `Search for: site:instagram.com OR site:youtube.com "${searchTerm}" influencer OR blogger OR creator. 
    Extract real details for 6 profiles found in the search results. Focus on finding people specifically in or related to "${searchTerm}".`;

    try {
      const result = await callGemini(prompt, systemPrompt, true);

      const cleanResult = result.replace(/```json/g, "").replace(/```/g, "").trim();
      const newInfluencers = JSON.parse(cleanResult);

      if (Array.isArray(newInfluencers)) {
        const colors = [
          "bg-blue-600",
          "bg-green-600",
          "bg-purple-600",
          "bg-orange-600",
          "bg-red-600",
          "bg-pink-600",
          "bg-indigo-600",
        ];
        const styledInfluencers = newInfluencers.map((inf: Influencer) => ({
          ...inf,
          image: colors[Math.floor(Math.random() * colors.length)],
        }));
        setInfluencers(styledInfluencers);
      }
    } catch (e) {
      console.error("Failed to parse AI results", e);
      alert("Could not fetch live data. Please try again.");
    } finally {
      setIsSearchingAI(false);
    }
  };

  const filteredInfluencers = influencers.filter((inf) => {
    const matchesSearch =
      inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNiche =
      selectedNiche === "All" ||
      inf.niche.toLowerCase().includes(selectedNiche.toLowerCase()) ||
      (selectedNiche === "Tech" && inf.niche.includes("Gadgets"));
    return matchesSearch && matchesNiche;
  });

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-800 pb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Rinads <span className="text-red-600">Connect</span>
              </h2>
              <p className="text-gray-400">
                The Influencer Marketplace. Collaborate with top creators to amplify your brand.
              </p>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border rounded-lg text-sm transition-colors ${
                  showFilters
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-300 hover:text-white hover:border-red-500"
                }`}
              >
                <Filter size={16} className="mr-2" /> Filter Niche
              </button>
              <button className="flex items-center px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors">
                Join as Creator
              </button>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <div className="mb-12 relative max-w-2xl mx-auto space-y-4">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRealTimeSearch()}
                  placeholder="Search influencers by name, niche, or location (e.g. Thrissur)..."
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-full px-6 py-4 pl-12 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-lg"
                />
                <Search className="absolute left-4 top-4 text-gray-500" size={20} />
              </div>
              <button
                onClick={handleRealTimeSearch}
                disabled={isSearchingAI || !searchTerm}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 rounded-full font-bold text-sm flex items-center whitespace-nowrap hover:shadow-[0_0_20px_rgba(220,20,60,0.4)] disabled:opacity-50 transition-all"
              >
                {isSearchingAI ? (
                  <>
                    <RefreshCw className="animate-spin mr-2" size={16} /> Searching Live...
                  </>
                ) : (
                  <>
                    <Globe className="mr-2" size={16} /> Live Search
                  </>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap justify-center gap-2 animate-in slide-in-from-top-2 fade-in">
                {niches.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedNiche === niche
                        ? "bg-red-600 text-white"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>

        {filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((inf, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-red-600/30 transition-all group hover:-translate-y-1 duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-full ${inf.image} flex items-center justify-center text-xl font-bold border-2 border-black shadow-lg overflow-hidden`}
                      >
                        {inf.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-red-500 transition-colors">
                          {inf.name}
                        </h3>
                        <p className="text-xs text-gray-500">{inf.niche}</p>
                        <p className="text-[10px] text-gray-400 flex items-center mt-1">
                          <MapPin size={10} className="mr-1" /> {inf.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-red-500 font-bold">{inf.followers}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                        Followers
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {inf.tags &&
                      inf.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-900 text-gray-400 text-xs rounded border border-gray-800"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-auto">
                    <div className="flex gap-3">
                      <Instagram
                        size={18}
                        className="text-gray-400 hover:text-pink-500 cursor-pointer transition-colors"
                      />
                      <Twitter
                        size={18}
                        className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                      />
                      <Linkedin
                        size={18}
                        className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{inf.rate}</span>
                      <button
                        onClick={() => alert(`Request sent to ${inf.name}!`)}
                        className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(220,20,60,0.3)]"
                      >
                        <Briefcase size={12} /> Hire
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-gray-900 mb-4">
              <Search size={32} className="text-gray-500" />
            </div>
            <p className="text-gray-400">No influencers found matching your criteria.</p>
            <p className="text-xs text-gray-500 mt-2">
              Try clicking &quot;Live Search&quot; to find real-time data from the web.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedNiche("All");
              }}
              className="mt-4 text-red-500 hover:text-red-400 text-sm font-bold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

