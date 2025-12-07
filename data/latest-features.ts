// Latest Features Data
// Update this file to add new features or modify existing ones
// Date format: YYYY-MM-DD

export interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  icon: string; // Icon name from lucide-react
  link?: string;
  badge?: string; // Optional badge like "New", "Beta", etc.
}

export const latestFeatures: Feature[] = [
  {
    id: "1",
    title: "AI-Powered Business Insights",
    description: "Get predictive analytics and automated recommendations tailored to your vertical. Our AI assistant now provides real-time business insights.",
    category: "AI & Automation",
    date: "2024-12-07",
    icon: "Zap",
    link: "/modules/ai-assistant",
    badge: "New",
  },
  {
    id: "2",
    title: "Enhanced Financial Reports",
    description: "New GST return export formats, improved balance sheet generation, and custom date range reporting for better financial management.",
    category: "Financial Reports",
    date: "2024-12-05",
    icon: "BarChart",
    link: "/modules/financial-reports",
  },
  {
    id: "3",
    title: "Multi-location Stock Transfers",
    description: "Seamlessly transfer inventory between branches with real-time updates. New franchise stock transfer workflow for better inventory management.",
    category: "Inventory",
    date: "2024-12-03",
    icon: "Package",
    link: "/modules/inventory-management",
  },
  {
    id: "4",
    title: "Advanced Automation Workflows",
    description: "Set up custom webhooks, WhatsApp automation, and event-based triggers. New automation builder for streamlined business processes.",
    category: "Automation",
    date: "2024-12-01",
    icon: "Settings",
    link: "/modules/automation",
  },
  {
    id: "5",
    title: "Real-time Inventory Alerts",
    description: "Get instant notifications when stock levels are low. Set custom reorder points and never run out of inventory again. Works across all verticals.",
    category: "Inventory",
    date: "2024-12-08",
    icon: "Package",
    link: "/modules/inventory-management",
    badge: "New",
  },
];

// Helper function to get features sorted by date (newest first)
export function getLatestFeatures(limit?: number): Feature[] {
  const sorted = [...latestFeatures].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

// Helper function to format date
export function formatFeatureDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

