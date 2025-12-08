"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  User,
  Building,
  IndianRupee,
  X,
  Edit,
  Trash2,
  ChevronDown,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import {
  loadPipelineData,
  savePipelineData,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunitiesByPipeline,
  getPipelineById,
  type Opportunity,
  type Pipeline,
  type Stage,
} from "@/lib/pipeline-data";

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  pipeline: Pipeline | null;
  onClose: () => void;
  onSave: (opp: Opportunity) => void;
  onDelete: (id: string) => void;
}

function OpportunityDetailModal({
  opportunity,
  pipeline,
  onClose,
  onSave,
  onDelete,
}: OpportunityDetailModalProps) {
  const [formData, setFormData] = useState<Partial<Opportunity>>({});

  useEffect(() => {
    if (opportunity) {
      setFormData(opportunity);
    } else {
      setFormData({
        title: "",
        company: "",
        client: "",
        amount: 0,
        owner: "",
        closingDate: "",
        stage: pipeline?.stages[0]?.id || "",
        description: "",
        probability: 50,
      });
    }
  }, [opportunity, pipeline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipeline) return;

    const oppData = {
      ...formData,
      pipelineId: pipeline.id,
    } as Opportunity;

    if (opportunity) {
      onSave(updateOpportunity(opportunity.id, oppData)!);
    } else {
      onSave(createOpportunity(oppData));
    }
    onClose();
  };

  if (!pipeline) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {opportunity ? "Edit Opportunity" : "Add Opportunity"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Opportunity Name *
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                placeholder="Enter opportunity name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Owner *
              </label>
              <input
                type="text"
                required
                value={formData.owner || ""}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                placeholder="Enter owner name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                placeholder="Select company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={formData.client || ""}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                placeholder="Select client"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={formData.amount || 0}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Closing Date
              </label>
              <input
                type="date"
                value={formData.closingDate || ""}
                onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stage *
              </label>
              <select
                required
                value={formData.stage || ""}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-600"
              >
                {pipeline.stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Probability (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probability || 50}
                onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 50 })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              placeholder="Enter description"
            />
          </div>

          <div className="flex gap-3 pt-4">
            {opportunity && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this opportunity?")) {
                    onDelete(opportunity.id);
                    onClose();
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              {opportunity ? "Update" : "Create"} Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FiltersProps {
  owners: string[];
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

interface FilterState {
  owner: string;
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
}

function FiltersPanel({ owners, onFilterChange, filters }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white hover:border-red-600 transition-colors flex items-center gap-2"
      >
        <Filter size={18} />
        Filters
        <ChevronDown size={18} className={isOpen ? "rotate-180" : ""} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 z-50 shadow-xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Owner</label>
              <select
                value={filters.owner}
                onChange={(e) => onFilterChange({ ...filters, owner: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-600"
              >
                <option value="">All Owners</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Amount</label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => onFilterChange({ ...filters, minAmount: e.target.value })}
                  placeholder="₹0"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Amount</label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => onFilterChange({ ...filters, maxAmount: e.target.value })}
                  placeholder="₹∞"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              onClick={() => {
                onFilterChange({
                  owner: "",
                  minAmount: "",
                  maxAmount: "",
                  startDate: "",
                  endDate: "",
                });
              }}
              className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AnalyticsPanelProps {
  opportunities: Opportunity[];
  stages: Stage[];
}

function AnalyticsPanel({ opportunities, stages }: AnalyticsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const avgDealSize = opportunities.length > 0 ? totalValue / opportunities.length : 0;
  const weightedValue = opportunities.reduce(
    (sum, opp) => sum + opp.amount * ((opp.probability || 50) / 100),
    0
  );

  const stageStats = stages.map((stage) => {
    const stageOpps = opportunities.filter((o) => o.stage === stage.id);
    const stageValue = stageOpps.reduce((sum, o) => sum + o.amount, 0);
    return {
      stage,
      count: stageOpps.length,
      value: stageValue,
    };
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white hover:border-red-600 transition-colors flex items-center gap-2"
      >
        <BarChart3 size={18} />
        Analytics
        <ChevronDown size={18} className={isOpen ? "rotate-180" : ""} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 z-50 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Pipeline Analytics</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold text-white">
                  ₹{new Intl.NumberFormat("en-IN").format(totalValue)}
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Avg Deal Size</div>
                <div className="text-2xl font-bold text-white">
                  ₹{new Intl.NumberFormat("en-IN").format(avgDealSize)}
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Weighted Value</div>
                <div className="text-2xl font-bold text-green-500">
                  ₹{new Intl.NumberFormat("en-IN").format(weightedValue)}
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Opportunities</div>
                <div className="text-2xl font-bold text-white">{opportunities.length}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">By Stage</h4>
              <div className="space-y-2">
                {stageStats.map(({ stage, count, value }) => (
                  <div key={stage.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${stage.color}`}></div>
                      <span className="text-sm text-gray-400">{stage.title}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{count}</div>
                      <div className="text-xs text-gray-500">
                        ₹{new Intl.NumberFormat("en-IN").format(value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PipelineBoard() {
  const [data, setData] = useState(loadPipelineData());
  const [selectedPipelineId, setSelectedPipelineId] = useState(data.pipelines[0]?.id || "");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    owner: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });
  const [draggedCard, setDraggedCard] = useState<{ stageId: string; oppId: string } | null>(null);

  const selectedPipeline = data.pipelines.find((p) => p.id === selectedPipelineId);
  const allOpportunities = data.opportunities.filter((o) => o.pipelineId === selectedPipelineId);

  // Apply filters and search
  const filteredOpportunities = allOpportunities.filter((opp) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.client?.toLowerCase().includes(searchQuery.toLowerCase());

    // Owner filter
    const matchesOwner = !filters.owner || opp.owner === filters.owner;

    // Amount filter
    const matchesMinAmount = !filters.minAmount || opp.amount >= parseFloat(filters.minAmount);
    const matchesMaxAmount = !filters.maxAmount || opp.amount <= parseFloat(filters.maxAmount);

    // Date filter
    const matchesStartDate = !filters.startDate || (opp.closingDate && opp.closingDate >= filters.startDate);
    const matchesEndDate = !filters.endDate || (opp.closingDate && opp.closingDate <= filters.endDate);

    return (
      matchesSearch &&
      matchesOwner &&
      matchesMinAmount &&
      matchesMaxAmount &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  // Group opportunities by stage
  const stagesWithOpportunities = selectedPipeline?.stages.map((stage) => ({
    ...stage,
    opportunities: filteredOpportunities.filter((o) => o.stage === stage.id),
  })) || [];

  const owners = Array.from(new Set(allOpportunities.map((o) => o.owner))).sort();

  function onDragStart(e: React.DragEvent, stageId: string, oppId: string) {
    setDraggedCard({ stageId, oppId });
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.currentTarget.classList.add("border-red-500", "border-2");
  }

  function onDragLeave(e: React.DragEvent) {
    e.currentTarget.classList.remove("border-red-500", "border-2");
  }

  function onDrop(e: React.DragEvent, toStageId: string) {
    e.preventDefault();
    e.currentTarget.classList.remove("border-red-500", "border-2");

    if (!draggedCard) return;

    const { stageId: fromStageId, oppId } = draggedCard;

    if (fromStageId === toStageId) {
      setDraggedCard(null);
      return;
    }

    const updated = updateOpportunity(oppId, { stage: toStageId });
    if (updated) {
      setData(loadPipelineData());
    }

    setDraggedCard(null);
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const totalOpportunities = filteredOpportunities.length;

  const handleSaveOpportunity = (opp: Opportunity) => {
    setData(loadPipelineData());
    setSelectedOpportunity(null);
    setShowAddModal(false);
  };

  const handleDeleteOpportunity = (id: string) => {
    deleteOpportunity(id);
    setData(loadPipelineData());
    setSelectedOpportunity(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Pipeline Selector */}
            <div className="flex items-center gap-3">
              <select
                value={selectedPipelineId}
                onChange={(e) => setSelectedPipelineId(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-red-600 font-medium"
              >
                {data.pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
              <div className="text-right flex-1">
                <div className="text-lg font-bold text-white">{formatCurrency(totalValue)}</div>
                <div className="text-xs text-gray-400">{totalOpportunities} Opportunities</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AnalyticsPanel opportunities={filteredOpportunities} stages={selectedPipeline?.stages || []} />
                <FiltersPanel owners={owners} onFilterChange={setFilters} filters={filters} />
                <button
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto pb-8">
        <div className="flex gap-4 p-4 min-w-max">
          {stagesWithOpportunities.map((stage) => {
            const stageValue = stage.opportunities.reduce((sum, opp) => sum + opp.amount, 0);
            return (
              <div
                key={stage.id}
                className="w-80 shrink-0 bg-[#0a0a0a] border border-gray-800 rounded-lg overflow-hidden flex flex-col"
              >
                {/* Stage Header */}
                <div className={`${stage.color} px-4 py-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg">{stage.title}</h3>
                    <span className="text-white/90 text-sm font-medium">{stage.opportunities.length}</span>
                  </div>
                  <div className="text-white/80 text-sm mt-1">{formatCurrency(stageValue)}</div>
                </div>

                {/* Opportunities List */}
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, stage.id)}
                  className="flex-1 p-3 space-y-3 min-h-[400px] bg-gray-950"
                >
                  {stage.opportunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                      <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-3">
                        <div className="text-2xl font-bold text-gray-700">P</div>
                      </div>
                      <p className="text-sm">No opportunities</p>
                    </div>
                  ) : (
                    stage.opportunities.map((opp) => (
                      <div
                        key={opp.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, stage.id, opp.id)}
                        onClick={() => {
                          setSelectedOpportunity(opp);
                          setShowAddModal(true);
                        }}
                        className="bg-gray-900 border border-gray-800 rounded-lg p-4 cursor-pointer hover:border-red-600/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-white text-base group-hover:text-red-500 transition-colors">
                            {opp.title}
                          </h4>
                          {opp.probability && (
                            <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                              {opp.probability}%
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          {opp.company && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Building size={14} />
                              <span>{opp.company}</span>
                            </div>
                          )}
                          {opp.client && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <User size={14} />
                              <span>{opp.client}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-red-500 font-semibold">
                            <IndianRupee size={14} />
                            <span>{formatCurrency(opp.amount)}</span>
                          </div>
                          {opp.closingDate && (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar size={14} />
                              <span>{formatDate(opp.closingDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {(showAddModal || selectedOpportunity) && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          pipeline={selectedPipeline || null}
          onClose={() => {
            setShowAddModal(false);
            setSelectedOpportunity(null);
          }}
          onSave={handleSaveOpportunity}
          onDelete={handleDeleteOpportunity}
        />
      )}
    </div>
  );
}
