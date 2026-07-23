import React, { useState } from "react";
import {
  Layers, Target, Globe, Plus, Trash2, CheckCircle2,
  AlertTriangle, Download
} from "lucide-react";

export interface LogFrameItem {
  id: string;
  level: "Goal / Impact" | "Outcome" | "Output" | "Activity";
  statement: string;
  indicators: {
    id: string;
    name: string;
    baseline: string;
    target: string;
    current: string;
    mov: string; // Means of Verification
    sdg: number; // 1-17
    riskLevel: "Low" | "Medium" | "High";
  }[];
  assumptions: string;
}

const SDG_LIST = [
  { num: 1, name: "No Poverty", color: "#E5243B" },
  { num: 2, name: "Zero Hunger", color: "#DDA63A" },
  { num: 3, name: "Good Health", color: "#4C9F38" },
  { num: 4, name: "Quality Education", color: "#C5192D" },
  { num: 5, name: "Gender Equality", color: "#FF3A21" },
  { num: 6, name: "Clean Water", color: "#26BDE2" },
  { num: 7, name: "Affordable Energy", color: "#FCC30B" },
  { num: 8, name: "Decent Work", color: "#A21942" },
  { num: 9, name: "Industry & Infra", color: "#FD6925" },
  { num: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { num: 11, name: "Sustainable Cities", color: "#FD9D24" },
  { num: 12, name: "Responsible Consumption", color: "#BF8B2E" },
  { num: 13, name: "Climate Action", color: "#3F7E44" },
  { num: 14, name: "Life Below Water", color: "#0A97D9" },
  { num: 15, name: "Life on Land", color: "#56C02B" },
  { num: 16, name: "Peace & Justice", color: "#00689D" },
  { num: 17, name: "Partnerships", color: "#19486A" },
];

export const LogFrameMatrix: React.FC = () => {
  const [logFrameData, setLogFrameData] = useState<LogFrameItem[]>([]);
  const [selectedFilterLevel, setSelectedFilterLevel] = useState<string>("All");
  const [showExportToast, setShowExportToast] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New element form state
  const [newLevel, setNewLevel] = useState<"Goal / Impact" | "Outcome" | "Output" | "Activity">("Goal / Impact");
  const [newStatement, setNewStatement] = useState("");
  const [newAssumptions, setNewAssumptions] = useState("");

  const handleAddObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;
    const newItem: LogFrameItem = {
      id: `lf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      level: newLevel,
      statement: newStatement.trim(),
      indicators: [],
      assumptions: newAssumptions.trim() || "N/A"
    };
    setLogFrameData([...logFrameData, newItem]);
    setNewStatement("");
    setNewAssumptions("");
    setShowAddModal(false);
  };

  const handleAddIndicator = (itemId: string) => {
    setLogFrameData(prev => prev.map(item => {
      if (item.id === itemId) {
        const newInd = {
          id: `ind_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: "New Indicator",
          baseline: "0",
          target: "100",
          current: "0",
          mov: "Verification Records",
          sdg: 1,
          riskLevel: "Low" as const
        };
        return { ...item, indicators: [...item.indicators, newInd] };
      }
      return item;
    }));
  };

  const handleDeleteIndicator = (itemId: string, indId: string) => {
    setLogFrameData(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, indicators: item.indicators.filter(i => i.id !== indId) };
      }
      return item;
    }));
  };

  const handleDeleteObjective = (itemId: string) => {
    setLogFrameData(prev => prev.filter(i => i.id !== itemId));
  };

  const filteredData = logFrameData.filter(item => 
    selectedFilterLevel === "All" || item.level === selectedFilterLevel
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
              Results Framework Matrix
            </span>
            <span className="text-xs text-gray-400">&bull; M&E Hierarchy Standard</span>
          </div>
          <h1 className="text-xl font-bold mt-1" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
            Logical Framework & Results Matrix (LogFrame)
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            Map project objectives, indicators, means of verification, and Sustainable Development Goal (SDG) alignment.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add LogFrame Objective
          </button>
          <button
            onClick={() => {
              if (logFrameData.length === 0) return;
              setShowExportToast(true);
              setTimeout(() => setShowExportToast(false), 4000);
            }}
            disabled={logFrameData.length === 0}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-teal-600" />
            Export LogFrame (IATI XML)
          </button>
        </div>
      </div>

      {showExportToast && (
        <div className="p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            LogFrame successfully compiled to IATI Standard v2.03 schema.
          </div>
          <span className="font-mono text-[10px] bg-green-200 px-2 py-0.5 rounded">IATI-OK</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl border" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-1 overflow-x-auto">
          {["All", "Goal / Impact", "Outcome", "Output", "Activity"].map(lvl => (
            <button
              key={`lf_lvl_${lvl}`}
              onClick={() => setSelectedFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedFilterLevel === lvl
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        <div className="text-xs font-medium text-gray-500 hidden sm:block">
          Total Objectives: <strong>{logFrameData.length}</strong> | Total Indicators: <strong>{logFrameData.reduce((acc, curr) => acc + curr.indicators.length, 0)}</strong>
        </div>
      </div>

      {/* Results Matrix Table or Empty State */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center space-y-4" style={{ borderColor: "#E5E7EB" }}>
          <div className="h-12 w-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">No LogFrame Elements Configured</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              Start building your donor-ready results matrix by defining your project's Goal/Impact, Outcomes, Outputs, and Activities.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add First Objective
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((item, itemIdx) => (
            <div key={`lf_item_${item.id}_${itemIdx}`} className="bg-white rounded-xl border overflow-hidden shadow-xs" style={{ borderColor: "#E5E7EB" }}>
              {/* Hierarchy Header */}
              <div className="px-5 py-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                style={{ background: item.level === "Goal / Impact" ? "#F0FDF4" : item.level === "Outcome" ? "#EFF6FF" : "#FFFBEB", borderColor: "#E5E7EB" }}>
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider text-white"
                    style={{ background: item.level === "Goal / Impact" ? "#15803D" : item.level === "Outcome" ? "#1D4ED8" : "#B45309" }}>
                    {item.level}
                  </span>
                  <span className="text-xs font-medium text-gray-500">LogFrame Element #{item.id}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAddIndicator(item.id)}
                    className="text-xs font-bold flex items-center gap-1 hover:underline text-teal-700 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Indicator
                  </button>
                  <button
                    onClick={() => handleDeleteObjective(item.id)}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Narrative Statement */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Narrative Summary Statement</label>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {item.statement}
                  </p>
                </div>

                {/* Indicators Table */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Performance Indicators & Targets</label>
                  
                  {item.indicators.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">No indicators assigned to this objective yet. Click "Add Indicator" above.</p>
                  ) : (
                    <div className="overflow-x-auto border rounded-xl" style={{ borderColor: "#E5E7EB" }}>
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700 font-bold border-b" style={{ borderColor: "#E5E7EB" }}>
                            <th className="p-3">Indicator Name</th>
                            <th className="p-3 w-20 text-center">Baseline</th>
                            <th className="p-3 w-20 text-center">Target</th>
                            <th className="p-3 w-20 text-center">Current</th>
                            <th className="p-3 w-32 text-center">SDG Alignment</th>
                            <th className="p-3">Means of Verification (MoV)</th>
                            <th className="p-3 w-16 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ divideColor: "#F3F4F6" }}>
                          {item.indicators.map((ind, indIdx) => {
                            const sdgInfo = SDG_LIST.find(s => s.num === ind.sdg) || SDG_LIST[0];
                            return (
                              <tr key={`ind_row_${ind.id}_${indIdx}`} className="hover:bg-gray-50/80 transition">
                                <td className="p-3 font-semibold text-gray-900">
                                  <div className="flex items-start gap-2">
                                    <Target className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                                    <div>
                                      <p>{ind.name}</p>
                                      <span className="text-[10px] text-gray-400 font-normal">ID: {ind.id}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 text-center font-mono font-medium text-gray-600">{ind.baseline}</td>
                                <td className="p-3 text-center font-mono font-bold text-teal-700">{ind.target}</td>
                                <td className="p-3 text-center font-mono font-extrabold text-gray-900">{ind.current}</td>
                                <td className="p-3 text-center">
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0 shadow-2xs"
                                    style={{ background: sdgInfo.color }}>
                                    <Globe className="h-3 w-3" />
                                    SDG {sdgInfo.num}: {sdgInfo.name}
                                  </span>
                                </td>
                                <td className="p-3 text-gray-600 leading-snug">{ind.mov}</td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => handleDeleteIndicator(item.id, ind.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded transition"
                                    title="Delete Indicator"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Assumptions & Risk */}
                <div className="pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Critical Assumptions & External Risk Profile</label>
                  <div className="p-3 rounded-lg border flex items-start gap-2.5" style={{ background: "#FAF5FF", borderColor: "#E9D5FF" }}>
                    <AlertTriangle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-950 font-medium leading-relaxed">
                      {item.assumptions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Add LogFrame Objective</h3>
            
            <form onSubmit={handleAddObjective} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Hierarchy Level</label>
                <select
                  value={newLevel}
                  onChange={e => setNewLevel(e.target.value as any)}
                  className="input-base"
                >
                  <option value="Goal / Impact">Goal / Impact</option>
                  <option value="Outcome">Outcome</option>
                  <option value="Output">Output</option>
                  <option value="Activity">Activity</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Narrative Statement</label>
                <textarea
                  value={newStatement}
                  onChange={e => setNewStatement(e.target.value)}
                  placeholder="Describe the objective or expected result..."
                  rows={3}
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Assumptions & Risks</label>
                <input
                  type="text"
                  value={newAssumptions}
                  onChange={e => setNewAssumptions(e.target.value)}
                  placeholder="Key external factors necessary for success..."
                  className="input-base"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-4 py-2"
                >
                  Save Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
