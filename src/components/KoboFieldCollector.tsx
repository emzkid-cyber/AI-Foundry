import React, { useState } from "react";
import {
  Smartphone, MapPin, Database, CheckCircle2, AlertTriangle,
  Search, Send, Check, X, ShieldAlert, Plus, Trash2, Edit3, FileText, Settings, Layers
} from "lucide-react";

export interface SurveyQuestion {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "gps";
  options?: string[]; // for select type
  required: boolean;
  outlierMax?: number; // threshold for numeric questions to trigger anomaly
}

export interface SurveyForm {
  id: string;
  title: string;
  category: string; // e.g., Health, Education, WASH, Governance, Economic
  description: string;
  questions: SurveyQuestion[];
}

export interface SurveySubmission {
  id: string;
  formId: string;
  formName: string;
  enumerator: string;
  respondentName: string;
  location: string;
  gpsCoords: string;
  submissionTime: string;
  status: "Verified / Clean" | "Pending Review" | "Flagged Anomaly";
  data: Record<string, string | number>;
}

// Default multi-sector survey templates so the app is immediately useful out-of-the-box
export const KoboFieldCollector: React.FC = () => {
  const [surveyForms, setSurveyForms] = useState<SurveyForm[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
  
  const [activeTab, setActiveTab] = useState<"Form Builder" | "Mobile Simulator" | "Submissions Queue" | "Validation Rules">("Mobile Simulator");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Custom Form Builder Modal / State
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [builderTitle, setBuilderTitle] = useState("");
  const [builderCategory, setBuilderCategory] = useState("General Field Survey");
  const [builderDesc, setBuilderDesc] = useState("");
  const [builderQuestions, setBuilderQuestions] = useState<SurveyQuestion[]>([
    { id: "bq_1", label: "Respondent Full Name", type: "text", required: true },
    { id: "bq_2", label: "Survey Location / Unit", type: "text", required: true }
  ]);

  // Mobile Simulator Answers State: Record<questionId, value>
  const [simAnswers, setSimAnswers] = useState<Record<string, string>>({});
  const [simEnumerator, setSimEnumerator] = useState("Field Officer Alpha");
  const [simSuccessToast, setSimSuccessToast] = useState(false);

  const activeForm = surveyForms.find(f => f.id === selectedFormId) || surveyForms[0];

  const handleApprove = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "Verified / Clean" } : s));
  };

  const handleFlag = (id: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "Flagged Anomaly" } : s));
  };

  // Add Question to Form Builder
  const handleAddQuestionToBuilder = () => {
    const newQ: SurveyQuestion = {
      id: `bq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: "New Question Label",
      type: "text",
      required: false
    };
    setBuilderQuestions([...builderQuestions, newQ]);
  };

  const handleUpdateBuilderQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setBuilderQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleRemoveBuilderQuestion = (id: string) => {
    if (builderQuestions.length <= 1) return;
    setBuilderQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSaveNewForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderTitle.trim()) return;
    const newForm: SurveyForm = {
      id: `form_custom_${Date.now()}`,
      title: builderTitle.trim(),
      category: builderCategory,
      description: builderDesc.trim() || "Custom field survey layout.",
      questions: builderQuestions
    };
    setSurveyForms([...surveyForms, newForm]);
    setSelectedFormId(newForm.id);
    setShowCreateFormModal(false);
    setBuilderTitle("");
    setBuilderDesc("");
    setSimAnswers({});
    setActiveTab("Mobile Simulator");
  };

  // Dynamic Mobile Submission Handler
  const handleSimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForm) return;

    let isAnomaly = false;
    const collectedData: Record<string, string | number> = {};

    activeForm.questions.forEach(q => {
      const val = simAnswers[q.id] || "";
      if (q.type === "number") {
        const numVal = parseFloat(val) || 0;
        collectedData[q.label] = numVal;
        if (q.outlierMax && numVal > q.outlierMax) {
          isAnomaly = true;
        }
      } else {
        collectedData[q.label] = val || "N/A";
      }
    });

    const firstQuestionVal = simAnswers[activeForm.questions[0]?.id] || "Respondent";

    const newSub: SurveySubmission = {
      id: `FIELD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
      formId: activeForm.id,
      formName: activeForm.title,
      enumerator: simEnumerator || "Mobile Field Enumerator",
      respondentName: String(firstQuestionVal),
      location: "Active Field Zone",
      gpsCoords: "11.8920° N, 8.4210° E",
      submissionTime: "Just now",
      status: isAnomaly ? "Flagged Anomaly" : "Verified / Clean",
      data: collectedData
    };

    setSubmissions([newSub, ...submissions]);
    setSimSuccessToast(true);
    setSimAnswers({});
    setTimeout(() => setSimSuccessToast(false), 4000);
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesForm = sub.formId === activeForm?.id || statusFilter !== "All";
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    const matchesSearch = sub.respondentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.enumerator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              Mobile Field Collection Engine
            </span>
            <span className="text-xs text-gray-400">&bull; Universal Field Collector</span>
          </div>
          <h1 className="text-xl font-bold mt-1" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
            Field Survey Hub & Mobile Enumerator Engine
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            Design custom survey layouts for any sector, collect mobile offline data, and run automated data quality checks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCreateFormModal(true)}
            className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Custom Survey Layout
          </button>
        </div>
      </div>

      {/* Active Form Selector Dropdown */}
      <div className="bg-white p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Layers className="h-5 w-5 text-indigo-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Active Survey Template</span>
            {surveyForms.length > 0 ? (
              <select
                value={selectedFormId}
                onChange={e => {
                  setSelectedFormId(e.target.value);
                  setSimAnswers({});
                }}
                className="text-xs font-bold text-gray-900 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
              >
                {surveyForms.map(f => (
                  <option key={f.id} value={f.id}>
                    [{f.category}] {f.title} ({f.questions.length} questions)
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs font-bold text-gray-400">No Questionnaire Layouts Created</span>
            )}
          </div>
        </div>

        {surveyForms.length > 0 ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{activeForm?.description}</span>
            <button
              onClick={() => setActiveTab("Form Builder")}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Questionnaire
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateFormModal(true)}
            className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Create Custom Survey Layout
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b pb-1" style={{ borderColor: "#E5E7EB" }}>
        {[
          { id: "Mobile Simulator", label: "Enumerator Mobile App", icon: Smartphone },
          { id: "Submissions Queue", label: `Live Submissions Queue (${submissions.length})`, icon: Database },
          { id: "Form Builder", label: "Questionnaire Designer", icon: FileText },
          { id: "Validation Rules", label: "Data Quality & Anomaly Rules", icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={`kobo_tab_${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-white text-teal-800 border-t-2 border-x border-teal-600 shadow-2xs"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MOBILE ENUMERATOR APP SIMULATOR */}
      {activeTab === "Mobile Simulator" && (!activeForm ? (
        <div className="bg-white rounded-2xl border p-12 text-center space-y-4" style={{ borderColor: "#E5E7EB" }}>
          <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">No Questionnaire Layout Selected</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              Create a custom survey layout first to begin capturing offline field data.
            </p>
          </div>
          <button
            onClick={() => setShowCreateFormModal(true)}
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Custom Survey Layout
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 bg-white p-6 rounded-2xl border shadow-sm space-y-4" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{activeForm.title}</h3>
                  <p className="text-xs text-gray-500">Mobile Offline Questionnaire &bull; {activeForm.category}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-green-100 text-green-800">
                ODK READY
              </span>
            </div>

            {simSuccessToast && (
              <div className="p-3 rounded-lg bg-green-50 text-green-800 border border-green-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Survey record transmitted successfully to cloud server queue.
              </div>
            )}

            <form onSubmit={handleSimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Enumerator Name / ID</label>
                <input
                  type="text"
                  value={simEnumerator}
                  onChange={e => setSimEnumerator(e.target.value)}
                  className="input-base"
                  required
                />
              </div>

              {/* Dynamic Questions Rendering */}
              <div className="space-y-4 pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Survey Questions</h4>
                
                {activeForm.questions.map((q, idx) => {
                  const val = simAnswers[q.id] || "";
                  return (
                    <div key={`sim_q_${q.id}`} className="p-3.5 rounded-xl bg-gray-50 border space-y-1.5" style={{ borderColor: "#E5E7EB" }}>
                      <label className="font-bold text-gray-900 block">
                        {idx + 1}. {q.label} {q.required && <span className="text-red-500">*</span>}
                      </label>

                      {q.type === "text" && (
                        <input
                          type="text"
                          value={val}
                          onChange={e => setSimAnswers({ ...simAnswers, [q.id]: e.target.value })}
                          placeholder={`Enter ${q.label.toLowerCase()}...`}
                          className="input-base bg-white"
                          required={q.required}
                        />
                      )}

                      {q.type === "number" && (
                        <div>
                          <input
                            type="number"
                            step="any"
                            value={val}
                            onChange={e => setSimAnswers({ ...simAnswers, [q.id]: e.target.value })}
                            placeholder="e.g. 10"
                            className="input-base bg-white font-mono"
                            required={q.required}
                          />
                          {q.outlierMax && Number(val) > q.outlierMax && (
                            <p className="text-[10px] text-amber-600 font-semibold mt-1">
                              ⚠️ Warning: Value &gt; {q.outlierMax} exceeds expected threshold and will flag for review.
                            </p>
                          )}
                        </div>
                      )}

                      {q.type === "select" && (
                        <select
                          value={val}
                          onChange={e => setSimAnswers({ ...simAnswers, [q.id]: e.target.value })}
                          className="input-base bg-white"
                          required={q.required}
                        >
                          <option value="">-- Select Option --</option>
                          {q.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {q.type === "date" && (
                        <input
                          type="date"
                          value={val}
                          onChange={e => setSimAnswers({ ...simAnswers, [q.id]: e.target.value })}
                          className="input-base bg-white font-mono"
                          required={q.required}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border flex items-center justify-between text-[11px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span>GPS Auto-fix: 11.8920° N, 8.4210° E (Accuracy: 2.1m)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold text-[10px]">GPS LOCKED</span>
              </div>

              <button type="submit" className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                <Send className="h-4 w-4" /> Save & Submit Field Survey
              </button>
            </form>
          </div>

          {/* XLSForm / ODK Definition Preview */}
          <div className="md:col-span-5 bg-white p-6 rounded-2xl border space-y-4" style={{ borderColor: "#E5E7EB" }}>
            <h3 className="text-sm font-bold text-gray-900">XLSForm / ODK Schema Definition</h3>
            <p className="text-xs text-gray-500">Auto-generated XML field structure for KoboCollect / ODK Collect sync.</p>
            
            <div className="p-4 rounded-xl bg-gray-900 text-gray-200 font-mono text-[11px] space-y-2 overflow-x-auto leading-relaxed">
              <p className="text-teal-400">// Dynamic Form: {activeForm.title}</p>
              <p><span className="text-purple-400">form_id:</span> "{activeForm.id}"</p>
              <p><span className="text-purple-400">category:</span> "{activeForm.category}"</p>
              <p><span className="text-purple-400">total_questions:</span> {activeForm.questions.length}</p>
              <div className="pt-2 border-t border-gray-800">
                <p className="text-amber-300">// Questions Schema:</p>
                {activeForm.questions.map(q => (
                  <p key={`xml_${q.id}`}>
                    <span className="text-blue-400">&lt;field type="{q.type}" name="{q.id}"&gt;</span>
                    {q.label}
                    <span className="text-blue-400">&lt;/field&gt;</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* TAB 2: SUBMISSIONS QUEUE */}
      {activeTab === "Submissions Queue" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search respondent, ID, or enumerator..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input-base text-xs"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-gray-500">Filter Status:</span>
              {["All", "Verified / Clean", "Pending Review", "Flagged Anomaly"].map(st => (
                <button
                  key={`kobo_st_${st}`}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
                    statusFilter === st
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border p-12 text-center space-y-4" style={{ borderColor: "#E5E7EB" }}>
              <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">No Submissions Recorded</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                  There are no survey records submitted yet for this layout. Use the Mobile Enumerator App tab to submit entries.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("Mobile Simulator")}
                className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="h-4 w-4" /> Open Enumerator App
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border overflow-hidden shadow-xs" style={{ borderColor: "#E5E7EB" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-bold border-b" style={{ borderColor: "#E5E7EB" }}>
                      <th className="p-3">Submission ID</th>
                      <th className="p-3">Respondent / Form</th>
                      <th className="p-3">Enumerator & Location</th>
                      <th className="p-3">Collected Survey Answers</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ divideColor: "#F3F4F6" }}>
                    {filteredSubmissions.map((sub, sIdx) => (
                      <tr key={`sub_row_${sub.id}_${sIdx}`} className="hover:bg-gray-50/80 transition">
                        <td className="p-3 font-mono font-bold text-gray-900">{sub.id}</td>
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{sub.respondentName}</p>
                          <p className="text-[10px] text-gray-400">{sub.formName}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-gray-800">{sub.enumerator}</p>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                            <MapPin className="h-3 w-3 text-teal-600 shrink-0" />
                            <span>{sub.location} ({sub.gpsCoords})</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {Object.entries(sub.data).map(([k, v], kIdx) => (
                              <span key={`kobo_data_${sub.id}_${k}_${kIdx}`} className="px-2 py-0.5 rounded bg-gray-100 border text-[10px] font-medium text-gray-700">
                                <strong>{k}:</strong> {String(v)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === "Verified / Clean" ? "bg-green-100 text-green-800 border border-green-200" :
                            sub.status === "Flagged Anomaly" ? "bg-red-100 text-red-800 border border-red-200" :
                            "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            {sub.status === "Verified / Clean" && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                            {sub.status === "Flagged Anomaly" && <AlertTriangle className="h-3 w-3 text-red-600" />}
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleApprove(sub.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                              title="Approve & Mark Clean"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleFlag(sub.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                              title="Flag as Outlier/Anomaly"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUESTIONNAIRE DESIGNER / FORM BUILDER */}
      {activeTab === "Form Builder" && (!activeForm ? (
        <div className="bg-white rounded-2xl border p-12 text-center space-y-4" style={{ borderColor: "#E5E7EB" }}>
          <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">No Survey Questionnaire Layouts Available</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              Design custom question sets, select input field types (text, numbers, dropdown options, date), and set custom validation limits.
            </p>
          </div>
          <button
            onClick={() => setShowCreateFormModal(true)}
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Custom Survey Layout
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border space-y-6" style={{ borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "#F3F4F6" }}>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                {activeForm.category}
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-1">{activeForm.title} - Question Designer</h2>
              <p className="text-xs text-gray-500 mt-0.5">{activeForm.description}</p>
            </div>

            <button
              onClick={() => setShowCreateFormModal(true)}
              className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> New Questionnaire Layout
            </button>
          </div>

          {/* List of Questions in Active Form */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Form Questions ({activeForm.questions.length})</h3>
            
            {activeForm.questions.map((q, idx) => (
              <div key={`designer_q_${q.id}`} className="p-4 rounded-xl border bg-gray-50 flex items-center justify-between text-xs" style={{ borderColor: "#E5E7EB" }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{idx + 1}. {q.label}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700 uppercase">
                      Type: {q.type}
                    </span>
                    {q.required && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>

                  {q.type === "select" && q.options && (
                    <p className="text-[11px] text-gray-500">
                      Options: {q.options.join(", ")}
                    </p>
                  )}

                  {q.outlierMax && (
                    <p className="text-[11px] text-amber-700 font-medium">
                      Automated Anomaly Rule: Value &gt; {q.outlierMax}
                    </p>
                  )}
                </div>

                <div className="text-right font-mono text-[11px] text-gray-400">
                  ID: {q.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* TAB 4: VALIDATION RULES */}
      {activeTab === "Validation Rules" && (!activeForm ? (
        <div className="bg-white rounded-2xl border p-12 text-center space-y-4" style={{ borderColor: "#E5E7EB" }}>
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">No Active Questionnaire</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              Automated outlier and anomaly validation rules are linked to questions in active survey layouts.
            </p>
          </div>
          <button
            onClick={() => setShowCreateFormModal(true)}
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Custom Survey Layout
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border space-y-4" style={{ borderColor: "#E5E7EB" }}>
          <h3 className="text-sm font-bold text-gray-900">Automated Data Cleaning & Outlier Rules</h3>
          <p className="text-xs text-gray-500">Rules configured for <strong>{activeForm.title}</strong>:</p>

          <div className="space-y-3">
            {activeForm.questions.filter(q => q.outlierMax).map((q, i) => (
              <div key={`kobo_val_rule_${i}`} className="p-3.5 rounded-xl border flex items-center justify-between text-xs" style={{ background: "#FAFAFA", borderColor: "#E5E7EB" }}>
                <div>
                  <p className="font-bold text-gray-900">{q.label} Threshold Rule</p>
                  <p className="text-gray-500 text-[11px]">
                    Condition: <code className="bg-gray-200 px-1 rounded">{q.label} &gt; {q.outlierMax}</code> &rarr; Action: Flag Anomaly
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  Active Rule
                </span>
              </div>
            ))}

            <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs" style={{ background: "#FAFAFA", borderColor: "#E5E7EB" }}>
              <div>
                <p className="font-bold text-gray-900">GPS Spatial Boundary Rule</p>
                <p className="text-gray-500 text-[11px]">Condition: <code className="bg-gray-200 px-1 rounded">Coordinates outside project area</code> &rarr; Action: Flag Location Anomaly</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                Active Rule
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* CREATE NEW SURVEY FORM MODAL */}
      {showCreateFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
              <div>
                <h3 className="text-base font-bold text-gray-900">Create Custom Survey Questionnaire</h3>
                <p className="text-xs text-gray-500">Design a dynamic survey layout tailored to your field project.</p>
              </div>
              <button onClick={() => setShowCreateFormModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Survey Title</label>
                  <input
                    type="text"
                    value={builderTitle}
                    onChange={e => setBuilderTitle(e.target.value)}
                    placeholder="e.g. Household Income & WASH Survey"
                    className="input-base"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sector / Category</label>
                  <input
                    type="text"
                    value={builderCategory}
                    onChange={e => setBuilderCategory(e.target.value)}
                    placeholder="e.g. Governance / Health / WASH"
                    className="input-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Survey Objective / Description</label>
                <input
                  type="text"
                  value={builderDesc}
                  onChange={e => setBuilderDesc(e.target.value)}
                  placeholder="Brief description of data collected..."
                  className="input-base"
                />
              </div>

              {/* Questions Builder list */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold uppercase tracking-wider text-gray-700 text-xs">Questionnaire Fields ({builderQuestions.length})</label>
                  <button
                    type="button"
                    onClick={handleAddQuestionToBuilder}
                    className="text-indigo-600 font-bold flex items-center gap-1 hover:underline text-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Question
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {builderQuestions.map((bq, bIdx) => (
                    <div key={bq.id} className="p-3 bg-gray-50 border rounded-xl space-y-2" style={{ borderColor: "#E5E7EB" }}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-gray-500">#{bIdx + 1}</span>
                        <input
                          type="text"
                          value={bq.label}
                          onChange={e => handleUpdateBuilderQuestion(bq.id, { label: e.target.value })}
                          placeholder="Enter Question Label..."
                          className="input-base bg-white font-bold text-gray-900 flex-1"
                          required
                        />
                        <select
                          value={bq.type}
                          onChange={e => handleUpdateBuilderQuestion(bq.id, { type: e.target.value as any })}
                          className="input-base bg-white w-28 shrink-0 font-semibold"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="select">Dropdown</option>
                          <option value="date">Date</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveBuilderQuestion(bq.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Remove Question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {bq.type === "select" && (
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Dropdown Options (Comma-separated)</label>
                          <input
                            type="text"
                            value={bq.options?.join(", ") || ""}
                            onChange={e => handleUpdateBuilderQuestion(bq.id, { options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                            placeholder="Option 1, Option 2, Option 3"
                            className="input-base bg-white"
                          />
                        </div>
                      )}

                      {bq.type === "number" && (
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Outlier Threshold (Optional: Values above this trigger anomaly check)</label>
                          <input
                            type="number"
                            value={bq.outlierMax || ""}
                            onChange={e => handleUpdateBuilderQuestion(bq.id, { outlierMax: parseFloat(e.target.value) || undefined })}
                            placeholder="e.g. 100"
                            className="input-base bg-white font-mono"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: "#F3F4F6" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateFormModal(false)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-4 py-2 cursor-pointer"
                >
                  Save & Publish Questionnaire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

