import React, { useState } from "react";
import {
  Star, ShieldCheck, Award, CheckCircle2, Edit3, Save
} from "lucide-react";

export interface EvaluationCriterion {
  id: string;
  name: "Relevance" | "Coherence" | "Effectiveness" | "Efficiency" | "Impact" | "Sustainability";
  score: number; // 0 to 5
  description: string;
  evidence: string;
}

export interface DqaPillar {
  pillar: "Validity" | "Reliability" | "Timeliness" | "Precision" | "Integrity";
  score: number; // percentage 0-100%
  status: "Pass" | "Needs Improvement" | "High Risk" | "Not Assessed";
  findings: string;
}

const DEFAULT_EVAL_CRITERIA: EvaluationCriterion[] = [
  {
    id: "eval_1",
    name: "Relevance",
    score: 0,
    description: "Extent to which project objectives respond to beneficiary needs and target priorities.",
    evidence: ""
  },
  {
    id: "eval_2",
    name: "Coherence",
    score: 0,
    description: "Compatibility and alignment of the intervention with other active initiatives and programs.",
    evidence: ""
  },
  {
    id: "eval_3",
    name: "Effectiveness",
    score: 0,
    description: "Extent to which intervention achieved or is expected to achieve planned outputs and outcomes.",
    evidence: ""
  },
  {
    id: "eval_4",
    name: "Efficiency",
    score: 0,
    description: "Extent to which intervention delivers economic and timely results relative to inputs.",
    evidence: ""
  },
  {
    id: "eval_5",
    name: "Impact",
    score: 0,
    description: "Higher-level transformative net changes produced directly or indirectly by intervention.",
    evidence: ""
  },
  {
    id: "eval_6",
    name: "Sustainability",
    score: 0,
    description: "Continuation or likelihood of net benefits continuing after primary funding terminates.",
    evidence: ""
  }
];

const DEFAULT_DQA_PILLARS: DqaPillar[] = [
  {
    pillar: "Validity",
    score: 0,
    status: "Not Assessed",
    findings: ""
  },
  {
    pillar: "Reliability",
    score: 0,
    status: "Not Assessed",
    findings: ""
  },
  {
    pillar: "Timeliness",
    score: 0,
    status: "Not Assessed",
    findings: ""
  },
  {
    pillar: "Precision",
    score: 0,
    status: "Not Assessed",
    findings: ""
  },
  {
    pillar: "Integrity",
    score: 0,
    status: "Not Assessed",
    findings: ""
  }
];

export const DqaEvaluationMatrix: React.FC = () => {
  const [evalCriteria, setEvalCriteria] = useState<EvaluationCriterion[]>(DEFAULT_EVAL_CRITERIA);
  const [dqaPillars, setDqaPillars] = useState<DqaPillar[]>(DEFAULT_DQA_PILLARS);
  const [activeTab, setActiveTab] = useState<"Evaluation Criteria" | "Data Quality Standards">("Evaluation Criteria");

  const [editingEvalId, setEditingEvalId] = useState<string | null>(null);
  const [editEvalScore, setEditEvalScore] = useState("0");
  const [editEvalEvidence, setEditEvalEvidence] = useState("");

  const [editingDqaIdx, setEditingDqaIdx] = useState<number | null>(null);
  const [editDqaScore, setEditDqaScore] = useState("0");
  const [editDqaFindings, setEditDqaFindings] = useState("");
  const [editDqaStatus, setEditDqaStatus] = useState<"Pass" | "Needs Improvement" | "High Risk" | "Not Assessed">("Not Assessed");

  const ratedCriteria = evalCriteria.filter(item => item.score > 0);
  const avgEvalScore = ratedCriteria.length > 0 
    ? (ratedCriteria.reduce((a, b) => a + b.score, 0) / ratedCriteria.length).toFixed(1)
    : "0.0";

  const ratedDqa = dqaPillars.filter(p => p.score > 0);
  const avgDqaScore = ratedDqa.length > 0
    ? Math.round(ratedDqa.reduce((a, b) => a + b.score, 0) / ratedDqa.length)
    : 0;

  const handleStartEditEval = (item: EvaluationCriterion) => {
    setEditingEvalId(item.id);
    setEditEvalScore(item.score.toString());
    setEditEvalEvidence(item.evidence);
  };

  const handleSaveEval = (id: string) => {
    const num = Math.min(5, Math.max(0, parseFloat(editEvalScore) || 0));
    setEvalCriteria(prev => prev.map(item => item.id === id ? {
      ...item,
      score: num,
      evidence: editEvalEvidence
    } : item));
    setEditingEvalId(null);
  };

  const handleStartEditDqa = (idx: number, p: DqaPillar) => {
    setEditingDqaIdx(idx);
    setEditDqaScore(p.score.toString());
    setEditDqaFindings(p.findings);
    setEditDqaStatus(p.status);
  };

  const handleSaveDqa = (idx: number) => {
    const num = Math.min(100, Math.max(0, parseInt(editDqaScore, 10) || 0));
    setDqaPillars(prev => prev.map((p, i) => i === idx ? {
      ...p,
      score: num,
      status: editDqaStatus,
      findings: editDqaFindings
    } : p));
    setEditingDqaIdx(null);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Data Quality & Evaluation Matrix
            </span>
            <span className="text-xs text-gray-400">&bull; Impact Assessment Standard</span>
          </div>
          <h1 className="text-xl font-bold mt-1" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
            Evaluation Matrix & Data Quality Assessment (DQA)
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            Rigorous evaluation scorecard and 5-Pillar Data Quality Assessment matrix.
          </p>
        </div>
      </div>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-2xs flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Evaluation Scorecard Rating</span>
            <p className="text-2xl font-black text-purple-900 mt-0.5">{avgEvalScore} / 5.0</p>
            <p className="text-xs text-purple-700 font-semibold">{ratedCriteria.length} of 6 Criteria Evaluated</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Award className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-2xs flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Data Quality Index (DQA)</span>
            <p className="text-2xl font-black text-green-700 mt-0.5">{avgDqaScore}%</p>
            <p className="text-xs text-green-800 font-semibold">{ratedDqa.length} of 5 Pillars Assessed</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b pb-1" style={{ borderColor: "#E5E7EB" }}>
        {(["Evaluation Criteria", "Data Quality Standards"] as const).map(t => (
          <button
            key={`dqa_tab_${t}`}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition cursor-pointer ${
              activeTab === t
                ? "bg-white text-purple-900 border-t-2 border-x border-purple-600 shadow-2xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* EVALUATION CRITERIA VIEW */}
      {activeTab === "Evaluation Criteria" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evalCriteria.map(item => {
            const isEditing = editingEvalId === item.id;
            return (
              <div key={`eval_card_${item.id}`} className="bg-white p-5 rounded-2xl border space-y-3 shadow-2xs" style={{ borderColor: "#E5E7EB" }}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-900">
                    {item.name}
                  </span>
                  {!isEditing ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 font-extrabold text-sm text-purple-900">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{item.score > 0 ? `${item.score} / 5.0` : "Unrated"}</span>
                      </div>
                      <button
                        onClick={() => handleStartEditEval(item)}
                        className="p-1 text-gray-400 hover:text-purple-700 transition cursor-pointer"
                        title="Evaluate Criterion"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSaveEval(item.id)}
                      className="btn-primary text-[10px] px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="h-3 w-3" /> Save Rating
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed">{item.description}</p>

                {!isEditing ? (
                  <div className="p-3 rounded-lg bg-gray-50 border text-xs text-gray-800 space-y-1" style={{ borderColor: "#E5E7EB" }}>
                    <span className="font-bold text-gray-900 text-[10px] uppercase block tracking-wider">Evaluation Evidence & Findings</span>
                    <p>{item.evidence || <span className="text-gray-400 italic">No evaluation findings recorded yet. Click the edit icon to rate and record findings.</span>}</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs space-y-2">
                    <div>
                      <label className="font-bold text-purple-900 block mb-1">Score (0.0 to 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editEvalScore}
                        onChange={e => setEditEvalScore(e.target.value)}
                        className="input-base text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-purple-900 block mb-1">Evaluation Evidence / Observations</label>
                      <textarea
                        value={editEvalEvidence}
                        onChange={e => setEditEvalEvidence(e.target.value)}
                        placeholder="Provide empirical evidence supporting this rating..."
                        rows={2}
                        className="input-base text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DATA QUALITY STANDARDS VIEW */}
      {activeTab === "Data Quality Standards" && (
        <div className="bg-white p-6 rounded-2xl border space-y-4" style={{ borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-bold text-gray-900">5 Data Quality Standards Matrix</h3>
          
          <div className="space-y-3">
            {dqaPillars.map((p, idx) => {
              const isEditing = editingDqaIdx === idx;
              return (
                <div key={`dqa_pillar_${p.pillar}_${idx}`} className="p-4 rounded-xl border space-y-2" style={{ background: "#FAFAFA", borderColor: "#E5E7EB" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-sm text-gray-900">{p.pillar} Standard</span>
                    </div>

                    {!isEditing ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-900">{p.score}%</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "Pass" ? "bg-green-100 text-green-800" :
                          p.status === "Needs Improvement" ? "bg-amber-100 text-amber-800" :
                          p.status === "High Risk" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {p.status}
                        </span>
                        <button
                          onClick={() => handleStartEditDqa(idx, p)}
                          className="p-1 text-gray-400 hover:text-green-700 transition cursor-pointer"
                          title="Assess Pillar"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSaveDqa(idx)}
                        className="btn-primary text-[10px] px-2.5 py-1 flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="h-3 w-3" /> Save Pillar
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {p.findings || <span className="text-gray-400 italic">Pillar assessment pending. Click edit icon to record DQA findings and score.</span>}
                    </p>
                  ) : (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-xs space-y-2 mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-green-900 block mb-1">Score % (0-100)</label>
                          <input
                            type="number"
                            value={editDqaScore}
                            onChange={e => setEditDqaScore(e.target.value)}
                            className="input-base text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-green-900 block mb-1">Audit Status</label>
                          <select
                            value={editDqaStatus}
                            onChange={e => setEditDqaStatus(e.target.value as any)}
                            className="input-base text-xs"
                          >
                            <option value="Not Assessed">Not Assessed</option>
                            <option value="Pass">Pass</option>
                            <option value="Needs Improvement">Needs Improvement</option>
                            <option value="High Risk">High Risk</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-green-900 block mb-1">DQA Verification Findings</label>
                        <textarea
                          value={editDqaFindings}
                          onChange={e => setEditDqaFindings(e.target.value)}
                          placeholder="Record findings regarding data validity, precision, and verification protocols..."
                          rows={2}
                          className="input-base text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
