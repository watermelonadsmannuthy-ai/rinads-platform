// Pipeline data management with localStorage persistence
// Can be easily swapped for API calls

export interface Opportunity {
  id: string;
  title: string;
  company?: string;
  client?: string;
  amount: number;
  owner: string;
  closingDate?: string;
  stage: string;
  pipelineId: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  probability?: number;
  tags?: string[];
}

export interface Stage {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
  createdAt: string;
}

const STORAGE_KEY = "rinads-pipeline-data";

// Default pipelines
export const defaultPipelines: Pipeline[] = [
  {
    id: "software-consulting",
    name: "Software Consulting",
    stages: [
      { id: "qualification", title: "Qualification", color: "bg-blue-600", order: 1 },
      { id: "gather-requirements", title: "Gather Requirements", color: "bg-purple-600", order: 2 },
      { id: "proposal", title: "Proposal/Price Quote", color: "bg-orange-600", order: 3 },
      { id: "implementation", title: "Implementation", color: "bg-yellow-600", order: 4 },
      { id: "training", title: "Training", color: "bg-indigo-600", order: 5 },
      { id: "payment-received", title: "Payment Received", color: "bg-green-600", order: 6 },
      { id: "cancelled", title: "Cancelled", color: "bg-red-600", order: 7 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "sales-pipeline",
    name: "Sales Pipeline",
    stages: [
      { id: "lead", title: "Lead", color: "bg-blue-600", order: 1 },
      { id: "qualified", title: "Qualified", color: "bg-purple-600", order: 2 },
      { id: "proposal", title: "Proposal", color: "bg-orange-600", order: 3 },
      { id: "won", title: "Won", color: "bg-green-600", order: 4 },
    ],
    createdAt: new Date().toISOString(),
  },
];

// Load data from localStorage
export function loadPipelineData(): {
  pipelines: Pipeline[];
  opportunities: Opportunity[];
} {
  if (typeof window === "undefined") {
    return { pipelines: defaultPipelines, opportunities: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        pipelines: data.pipelines || defaultPipelines,
        opportunities: data.opportunities || [],
      };
    }
  } catch (error) {
    console.error("Error loading pipeline data:", error);
  }

  // Initialize with default data
  const initialData = {
    pipelines: defaultPipelines,
    opportunities: [
      {
        id: "opp-1",
        title: "RINADS BUSINESS OS",
        company: "RINADS",
        client: "Andrino T D",
        amount: 20000,
        owner: "Andrino T D",
        closingDate: "2025-12-10",
        stage: "gather-requirements",
        pipelineId: "software-consulting",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: "Complete BusinessOS implementation",
        probability: 75,
      },
    ],
  };

  savePipelineData(initialData.pipelines, initialData.opportunities);
  return initialData;
}

// Save data to localStorage
export function savePipelineData(
  pipelines: Pipeline[],
  opportunities: Opportunity[]
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ pipelines, opportunities })
    );
  } catch (error) {
    console.error("Error saving pipeline data:", error);
  }
}

// CRUD operations for opportunities
export function createOpportunity(opportunity: Omit<Opportunity, "id" | "createdAt" | "updatedAt">): Opportunity {
  const data = loadPipelineData();
  const newOpp: Opportunity = {
    ...opportunity,
    id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.opportunities.push(newOpp);
  savePipelineData(data.pipelines, data.opportunities);
  return newOpp;
}

export function updateOpportunity(id: string, updates: Partial<Opportunity>): Opportunity | null {
  const data = loadPipelineData();
  const index = data.opportunities.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updated = {
    ...data.opportunities[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  data.opportunities[index] = updated;
  savePipelineData(data.pipelines, data.opportunities);
  return updated;
}

export function deleteOpportunity(id: string): boolean {
  const data = loadPipelineData();
  const index = data.opportunities.findIndex((o) => o.id === id);
  if (index === -1) return false;

  data.opportunities.splice(index, 1);
  savePipelineData(data.pipelines, data.opportunities);
  return true;
}

export function getOpportunitiesByPipeline(pipelineId: string): Opportunity[] {
  const data = loadPipelineData();
  return data.opportunities.filter((o) => o.pipelineId === pipelineId);
}

export function getPipelineById(pipelineId: string): Pipeline | undefined {
  const data = loadPipelineData();
  return data.pipelines.find((p) => p.id === pipelineId);
}



