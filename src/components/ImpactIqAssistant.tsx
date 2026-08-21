import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles, Send, Trash2, RefreshCw, Copy, Check, AlertCircle,
  Folder, ArrowUpRight, BookOpen, FileText, FlaskConical, Layers,
  ChevronDown, ChevronUp, Bot, User, ShieldCheck, Zap, Info, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  provider?: string;
  isLive?: boolean;
}

interface Indicator {
  name: string;
  target: number;
  current: number;
  unit: string;
}

interface Project {
  id: string;
  name: string;
  donor: string;
  programArea: string;
  health: "green" | "amber" | "red";
  progress: number;
  startDate: string;
  endDate: string;
  description: string;
  indicators: Indicator[];
  activityTimeline: string[];
  status: "Active" | "Archived";
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  projectId: string;
  uploadedAt: string;
  status: "Indexed" | "Processing" | "Ready";
  wordCount: number;
  sampleSnippet?: string;
}

interface Report {
  id: string;
  name: string;
  projectId: string;
  status: "Draft" | "Published" | "Under Review";
  lastSaved: string;
  sections: { [k: string]: string };
}

interface Insight {
  id: string;
  title: string;
  category: "Demographic" | "Operational" | "Impact" | "Behavioral";
  summary: string;
  confidence: "High" | "Medium" | "Low";
  evidenceCount: number;
  dateAdded: string;
}

interface KBDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  projectTag?: string;
  tags: string[];
}

interface CurrentUser {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarColor: string;
  initials: string;
  isLoggedIn: boolean;
}

interface ImpactIqAssistantProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  files: UploadedFile[];
  reports: Report[];
  insights: Insight[];
  kbDocs: KBDoc[];
  currentUser: CurrentUser;
}

const SUGGESTED_QUESTIONS = [
  "Summarize this project",
  "Identify key challenges",
  "Generate recommendations",
  "Analyze project performance",
  "Create a management summary"
];

export const ImpactIqAssistant: React.FC<ImpactIqAssistantProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  files,
  reports,
  insights,
  kbDocs,
  currentUser,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    const saved = localStorage.getItem("impact_iq_assistant_messages");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved assistant messages", e);
      }
    }
    return [];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [assistantStatus, setAssistantStatus] = useState<{
    configured: boolean;
    provider: string;
    model: string;
  }>({
    configured: false,
    provider: "Meta Llama",
    model: "llama-3.3-70b-versatile"
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeProject = projects.find(p => p.id === selectedProjectId) || (projects.length > 0 ? projects[0] : null);

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem("impact_iq_assistant_messages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Check assistant configuration status from server
  useEffect(() => {
    fetch("/api/assistant/status")
      .then(res => res.json())
      .then(data => {
        if (data && data.model) {
          setAssistantStatus({
            configured: !!data.configured,
            provider: data.provider || "Meta Llama",
            model: data.model || "llama-3.3-70b-versatile"
          });
        }
      })
      .catch(err => {
        console.warn("Could not check assistant status endpoint", err);
      });
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!query || isLoading) return;

    setErrorMessage(null);
    const userMsgId = `user_${Date.now()}`;
    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: AssistantMessage = {
      id: userMsgId,
      role: "user",
      content: query,
      timestamp: newTimestamp,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    // Prepare scoped project context
    const projectFiles = activeProject ? files.filter(f => f.projectId === activeProject.id) : [];
    const projectReports = activeProject ? reports.filter(r => r.projectId === activeProject.id) : [];
    const relevantKb = activeProject ? kbDocs.filter(k => !k.projectTag || k.projectTag === activeProject.name) : kbDocs;

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
          project: activeProject ? {
            id: activeProject.id,
            name: activeProject.name,
            donor: activeProject.donor,
            programArea: activeProject.programArea,
            health: activeProject.health,
            progress: activeProject.progress,
            startDate: activeProject.startDate,
            endDate: activeProject.endDate,
            description: activeProject.description,
            indicators: activeProject.indicators,
            activityTimeline: activeProject.activityTimeline,
            status: activeProject.status
          } : null,
          researchFiles: projectFiles.map(f => ({ name: f.name, snippet: f.sampleSnippet || "", wordCount: f.wordCount })),
          reports: projectReports.map(r => ({ name: r.name, status: r.status, sections: r.sections })),
          insights: insights.map(i => ({ title: i.title, summary: i.summary, confidence: i.confidence, category: i.category })),
          kbDocs: relevantKb.slice(0, 3).map(k => ({ title: k.title, content: k.content.slice(0, 500) })),
          user: {
            name: currentUser.name,
            role: currentUser.role,
            organization: currentUser.organization
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const aiMsgId = `assistant_${Date.now()}`;
      const aiMessage: AssistantMessage = {
        id: aiMsgId,
        role: "assistant",
        content: data.text || "I was unable to generate a response for this project query. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || assistantStatus.model,
        provider: data.provider || assistantStatus.provider,
        isLive: data.isLive
      };

      setMessages([...updatedMessages, aiMessage]);
    } catch (err: any) {
      console.error("AI Assistant request failed:", err);
      setErrorMessage("Unable to reach the AI assistant. Please check your connection or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear this conversation history?")) {
      setMessages([]);
      localStorage.removeItem("impact_iq_assistant_messages");
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Stats for current project context
  const projectFilesCount = activeProject ? files.filter(f => f.projectId === activeProject.id).length : 0;
  const projectReportsCount = activeProject ? reports.filter(r => r.projectId === activeProject.id).length : 0;
  const projectIndicatorsCount = activeProject ? activeProject.indicators?.length || 0 : 0;

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0D9488 100%)" }}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">ImpactIQ AI Assistant</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: "#EEF2FF", color: "#3730A3", border: "1px solid #C7D2FE" }}>
                  <Bot className="h-3.5 w-3.5" />
                  Powered by Meta Llama
                </span>
                {assistantStatus.model && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                    {assistantStatus.model}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Evidence-grounded project intelligence for M&amp;E coordinators, researchers, and project managers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Active Project Selector */}
            <div className="flex items-center gap-1.5 bg-gray-50 border rounded-xl px-3 py-1.5" style={{ borderColor: "#E5E7EB" }}>
              <Folder className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="text-xs text-gray-500 font-medium">Context:</span>
              <select
                value={selectedProjectId || (activeProject ? activeProject.id : "")}
                onChange={e => onSelectProject(e.target.value)}
                className="text-xs font-semibold text-gray-900 bg-transparent border-0 focus:ring-0 cursor-pointer outline-none max-w-[200px] truncate"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Clear Conversation */}
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 rounded-xl px-3 py-2 transition"
                title="Clear current conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Context Pill & Details toggle */}
        {activeProject && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t text-xs text-gray-600" style={{ borderColor: "#F3F4F6" }}>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-semibold text-gray-800">{activeProject.name}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">Donor: {activeProject.donor}</span>
              <span className="text-gray-300">•</span>
              <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-200">
                {projectIndicatorsCount} Indicators Loaded
              </span>
              <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium border border-indigo-200">
                {projectReportsCount} Reports
              </span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                {projectFilesCount} Transcripts/Files
              </span>
            </div>

            <button
              onClick={() => setShowContextDrawer(prev => !prev)}
              className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium self-start sm:self-auto"
            >
              <Info className="h-3.5 w-3.5" />
              <span>{showContextDrawer ? "Hide Context Details" : "View Context Details"}</span>
              {showContextDrawer ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}

        {/* Collapsible Context Preview */}
        <AnimatePresence>
          {showContextDrawer && activeProject && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gray-50 rounded-xl p-3 border text-xs space-y-2"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Project Description &amp; Scope:</p>
                  <p className="text-gray-600 bg-white p-2 rounded border border-gray-200 leading-relaxed">
                    {activeProject.description || "No description provided."}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Active Indicators &amp; Target Progress:</p>
                  <div className="bg-white p-2 rounded border border-gray-200 space-y-1.5 max-h-32 overflow-y-auto">
                    {activeProject.indicators && activeProject.indicators.length > 0 ? (
                      activeProject.indicators.map((ind, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span className="text-gray-700 truncate mr-2">{ind.name}</span>
                          <span className="font-semibold text-teal-700 shrink-0">
                            {ind.current.toLocaleString()} / {ind.target.toLocaleString()} {ind.unit}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">No indicators assigned</p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 italic">
                * The ImpactIQ AI Assistant processes only this project's scoped indicators, findings, reports, and transcripts. Cross-organization data isolation is enforced.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-[600px]" style={{ borderColor: "#E5E7EB" }}>
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8 space-y-5">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner"
                style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                <Bot className="h-7 w-7 text-indigo-600" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-gray-900">
                  How can I help with {activeProject ? activeProject.name : "your project"} today?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Ask natural-language questions about project progress, indicator performance, qualitative transcripts, key challenges, or donor report summaries.
                </p>
              </div>

              {/* Suggested Questions Grid */}
              <div className="w-full space-y-2 pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-left">
                  Suggested Questions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-xs text-gray-700 hover:text-indigo-700 bg-gray-50 hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-200 p-3 rounded-xl transition flex items-center justify-between group"
                    >
                      <span className="font-medium">{q}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-600 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm"
                      style={{
                        background: isUser ? currentUser.avatarColor || "#1B3A6B" : "#1B3A6B",
                        color: "white"
                      }}
                    >
                      {isUser ? currentUser.initials || "ME" : <Bot className="h-4 w-4" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isUser ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 px-1 text-[11px] text-gray-400">
                        <span className="font-semibold text-gray-700">
                          {isUser ? currentUser.name : "ImpactIQ AI Assistant"}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {!isUser && msg.model && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                              {msg.model}
                            </span>
                          </>
                        )}
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? "bg-teal-700 text-white rounded-tr-none shadow-sm"
                            : "bg-gray-50 text-gray-900 border rounded-tl-none space-y-2.5"
                        }`}
                        style={!isUser ? { borderColor: "#E5E7EB" } : {}}
                      >
                        {/* Message content formatted */}
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>

                        {!isUser && (
                          <div className="pt-2 mt-2 border-t flex items-center justify-between text-[11px] text-gray-400" style={{ borderColor: "#E5E7EB" }}>
                            <span className="flex items-center gap-1 text-[10px] text-indigo-700 font-medium">
                              <ShieldCheck className="h-3 w-3" />
                              Evidence-grounded project analysis
                            </span>
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="hover:text-gray-700 flex items-center gap-1 transition"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-600" />
                                  <span className="text-emerald-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading State */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 bg-indigo-950 text-white shadow-sm">
                    <Bot className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="bg-gray-50 border rounded-2xl rounded-tl-none p-4 space-y-2 text-xs" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex items-center gap-2 text-indigo-700 font-medium">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Meta Llama analyzing project context &amp; indicators...</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center justify-between text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">
              Dismiss
            </button>
          </div>
        )}

        {/* Suggested Quick Prompts Bar (when chat has messages) */}
        {messages.length > 0 && !isLoading && (
          <div className="px-4 py-2 border-t bg-gray-50/70 flex items-center gap-2 overflow-x-auto no-scrollbar" style={{ borderColor: "#F3F4F6" }}>
            <span className="text-[11px] text-gray-400 font-medium shrink-0">Suggestions:</span>
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-medium text-gray-600 hover:text-teal-700 bg-white hover:bg-teal-50 border border-gray-200 hover:border-teal-200 px-2.5 py-1 rounded-lg shrink-0 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 md:p-4 border-t bg-white rounded-b-2xl" style={{ borderColor: "#E5E7EB" }}>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 bg-gray-50 border rounded-xl p-2 focus-within:border-teal-600 focus-within:bg-white transition" style={{ borderColor: "#E5E7EB" }}>
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={activeProject ? `Ask about "${activeProject.name}" (e.g. key challenges, recommendations, indicator status)...` : "Ask any project intelligence question..."}
                className="w-full text-xs bg-transparent border-0 focus:ring-0 resize-none outline-none text-gray-900 placeholder:text-gray-400 max-h-32"
                style={{ minHeight: "24px" }}
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="h-10 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
              style={{ background: "#0D9488" }}
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 px-1">
            <span>Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 border text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 border text-[10px]">Shift + Enter</kbd> for newline</span>
            <span>ImpactIQ Project Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
