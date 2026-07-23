import React, { useState } from "react";
import {
  Building2, Plus, Download, AlertTriangle, FileCheck, CheckCircle2,
  Calendar, Shield
} from "lucide-react";

export interface GrantAgreement {
  id: string;
  grantNumber: string;
  donorName: string; // e.g. USAID, EU Horizon, Global Fund, FCDO
  projectTitle: string;
  totalBudget: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Pending Signing" | "Closeout Phase";
  complianceRisk: "Low" | "Medium" | "High";
  complianceChecklist: {
    rule: string;
    description: string;
    verified: boolean;
  }[];
  tranches: {
    number: number;
    amount: number;
    milestone: string;
    status: "Disbursed" | "Pending Audit" | "Upcoming";
  }[];
}

export const GrantComplianceHub: React.FC = () => {
  const [grants, setGrants] = useState<GrantAgreement[]>([]);
  const [selectedGrantId, setSelectedGrantId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Grant state
  const [newDonor, setNewDonor] = useState("USAID");
  const [newTitle, setNewTitle] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newGrantNum, setNewGrantNum] = useState("");

  const handleAddGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newGrant: GrantAgreement = {
      id: `grant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      grantNumber: newGrantNum.trim() || `GRANT-2026-${Math.floor(100 + Math.random() * 900)}`,
      donorName: newDonor,
      projectTitle: newTitle.trim(),
      totalBudget: parseFloat(newBudget) || 100000,
      currency: "USD",
      startDate: "2026-06-01",
      endDate: "2027-05-31",
      status: "Active",
      complianceRisk: "Low",
      complianceChecklist: [
        { rule: "2 CFR 200 Subpart E Procurement", description: "Competitive bidding thresholds applied to equipment purchases", verified: true },
        { rule: "Vetting & Anti-Terrorism Screening", description: "Key personnel screened against consolidated sanctions list", verified: true },
        { rule: "Branding & Marking Plan", description: "Donor logo placement verified on field deliverables", verified: true }
      ],
      tranches: [
        { number: 1, amount: (parseFloat(newBudget) || 100000) * 0.5, milestone: "Inception & Baseline Study", status: "Disbursed" },
        { number: 2, amount: (parseFloat(newBudget) || 100000) * 0.5, milestone: "Midterm Evaluation", status: "Upcoming" }
      ]
    };
    setGrants([...grants, newGrant]);
    setSelectedGrantId(newGrant.id);
    setNewTitle("");
    setNewBudget("");
    setNewGrantNum("");
    setShowAddModal(false);
  };

  const handleToggleRule = (grantId: string, ruleIndex: number) => {
    setGrants(prev => prev.map(g => {
      if (g.id === grantId) {
        const updated = [...g.complianceChecklist];
        updated[ruleIndex] = { ...updated[ruleIndex], verified: !updated[ruleIndex].verified };
        return { ...g, complianceChecklist: updated };
      }
      return g;
    }));
  };

  const selectedGrant = grants.find(g => g.id === selectedGrantId) || grants[0];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Grant Compliance Hub
            </span>
            <span className="text-xs text-gray-400">&bull; Multi-Donor Portfolio Engine</span>
          </div>
          <h1 className="text-xl font-bold mt-1" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
            Donor Compliance & Grant Lifecycle Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            Track grant agreements, mandatory compliance rules, disbursement tranches, and audit-ready verification records.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Register Grant Agreement
          </button>
        </div>
      </div>

      {/* Main Content */}
      {grants.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center space-y-4" style={{ borderColor: "#E5E7EB" }}>
          <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">No Active Donor Grant Agreements</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              Register grant agreements from institutional donors (USAID, EU, FCDO, Global Fund) to track compliance requirements and disbursement tranches.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Register First Grant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Grant Selection List */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Grant Portfolio</h3>
            {grants.map((grant, gIdx) => {
              const isSelected = grant.id === selectedGrant?.id;
              return (
                <div
                  key={`grant_item_${grant.id}_${gIdx}`}
                  onClick={() => setSelectedGrantId(grant.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-purple-50/50 border-purple-500 shadow-xs"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {grant.donorName}
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-900">
                      ${grant.totalBudget.toLocaleString()} USD
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 mt-2">{grant.projectTitle}</h4>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">{grant.grantNumber}</p>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-gray-500 pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                    <span>Rules: {grant.complianceChecklist.filter(c => c.verified).length}/{grant.complianceChecklist.length} Checked</span>
                    <span className="font-semibold text-teal-700">{grant.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Grant Details */}
          {selectedGrant && (
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border space-y-6" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex items-start justify-between pb-4 border-b" style={{ borderColor: "#F3F4F6" }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 font-extrabold text-xs">
                      {selectedGrant.donorName}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{selectedGrant.grantNumber}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mt-1">{selectedGrant.projectTitle}</h2>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Commitment</p>
                  <p className="text-lg font-black text-purple-900 font-mono">
                    ${selectedGrant.totalBudget.toLocaleString()} {selectedGrant.currency}
                  </p>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-purple-600" /> Mandatory Compliance Matrix
                </h3>

                <div className="space-y-2">
                  {selectedGrant.complianceChecklist.map((rule, rIdx) => (
                    <div
                      key={`grant_rule_${selectedGrant.id}_${rIdx}`}
                      onClick={() => handleToggleRule(selectedGrant.id, rIdx)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                        rule.verified ? "bg-green-50/50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={rule.verified}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{rule.rule}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disbursement Tranches */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-teal-600" /> Disbursement Schedule & Milestones
                </h3>

                <div className="space-y-2">
                  {selectedGrant.tranches.map((t, tIdx) => (
                    <div key={`tranche_${selectedGrant.id}_${t.number}_${tIdx}`} className="p-3 rounded-xl border flex items-center justify-between text-xs" style={{ background: "#FAFAFA", borderColor: "#E5E7EB" }}>
                      <div>
                        <p className="font-bold text-gray-900">Tranche #{t.number}: {t.milestone}</p>
                        <p className="text-[11px] text-gray-500">Amount: <strong className="font-mono text-gray-800">${t.amount.toLocaleString()} USD</strong></p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "Disbursed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Grant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Register Grant Agreement</h3>

            <form onSubmit={handleAddGrant} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Donor Organization</label>
                <select
                  value={newDonor}
                  onChange={e => setNewDonor(e.target.value)}
                  className="input-base"
                >
                  <option value="USAID">USAID (United States Agency for International Development)</option>
                  <option value="EU Horizon">European Union (EU Horizon / DEVCO)</option>
                  <option value="FCDO">FCDO (UK Foreign, Commonwealth & Dev Office)</option>
                  <option value="Global Fund">The Global Fund</option>
                  <option value="World Bank">World Bank / IFC</option>
                  <option value="Private Foundation">Private Foundation / Philanthropy</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Sustainable Agricultural Resilience Grant"
                  className="input-base"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Grant Number / Code</label>
                  <input
                    type="text"
                    value={newGrantNum}
                    onChange={e => setNewGrantNum(e.target.value)}
                    placeholder="e.g. 7200AA20C0001"
                    className="input-base font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Total Budget (USD)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={e => setNewBudget(e.target.value)}
                    placeholder="e.g. 500000"
                    className="input-base font-mono"
                    required
                  />
                </div>
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
                  Save Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
