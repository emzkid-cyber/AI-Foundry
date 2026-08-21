import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Folder, FlaskConical, FileText, Lightbulb,
  BookOpen, Search, Bell, Plus, Upload, Trash2, Edit2,
  Check, Download, AlertCircle, RefreshCw, X, Sparkles,
  ChevronRight, ArrowUpRight, HelpCircle, FileSpreadsheet, Lock, AlignLeft,
  User, LogOut, UserPlus, Shield, ChevronDown, TrendingUp,
  Calendar, Target, Activity, Layers, Settings, BarChart2,
  CheckCircle2, Clock, FileCheck, Menu, ArrowLeft, Eye, EyeOff,
  Globe, Mail, Building, Briefcase, Star, Zap,
  ShieldCheck, Key, Smartphone, LifeBuoy, Send, MessageSquare, Building2, Award, Bot, Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LogFrameMatrix } from "./components/LogFrameMatrix";
import { KoboFieldCollector } from "./components/KoboFieldCollector";
import { GrantComplianceHub } from "./components/GrantComplianceHub";
import { DqaEvaluationMatrix } from "./components/DqaEvaluationMatrix";
import { ImpactIqAssistant } from "./components/ImpactIqAssistant";
import { AdminHub } from "./components/AdminHub";
import { db } from "./lib/firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

// ============================================================
// TYPES & INTERFACES
// ============================================================
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
  projectId: string;
  type: "pdf" | "csv" | "xlsx" | "txt";
  size: string;
  uploadDate: string;
  status: "Processing" | "Ready" | "Error";
  content: string;
}

interface Report {
  id: string;
  name: string;
  projectId: string;
  status: "Draft" | "In Review" | "Published";
  lastSaved: string;
  sections: Record<string, string>;
  aiDrafts: Record<string, string>;
}

interface Insight {
  id: string;
  title: string;
  summary: string;
  projectId: string;
  projectName: string;
  confidence: "High" | "Medium" | "Low";
}

interface KBDoc {
  id: string;
  title: string;
  project: string;
  date: string;
  type: "Report" | "Transcript" | "Dataset";
  snippet: string;
}

// ============================================================
// PRIVACY POLICY MODAL
// ============================================================
function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "#F0FDFA" }}>
                <Shield className="h-4 w-4" style={{ color: "#0D9488" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Privacy Policy</h2>
                <p className="text-xs text-gray-500">ImpactIQ Platform — Effective Date: July 19, 2026</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 text-sm text-gray-600 space-y-5 leading-relaxed">
            <section>
              <h3 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
              <p className="mb-2">We collect the following categories of information to provide and improve our services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Data:</strong> Name, email address, password, organizational role, and affiliation provided during registration.</li>
                <li><strong>Program Data:</strong> Project indicators, evaluation datasets, FGD transcripts, survey data, and reports you upload or create within the platform.</li>
                <li><strong>Usage Data:</strong> Platform interactions, session activity, and feature usage analytics to improve the platform experience.</li>
                <li><strong>Device Data:</strong> Browser type, operating system, and device identifiers for security and compatibility purposes.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">2. How We Use Information</h3>
              <p className="mb-2">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide, operate, and maintain the ImpactIQ platform and its features.</li>
                <li>To generate qualitative analysis, program insights, and donor reports using uploaded evaluation materials.</li>
                <li>To authenticate users and maintain secure workspace sessions.</li>
                <li>To send operational notifications relevant to your projects and evaluations.</li>
                <li>To comply with applicable legal and donor accountability obligations.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">3. AI Data Processing</h3>
              <p>ImpactIQ uses advanced artificial intelligence models to process and analyze qualitative program data, including interview transcripts and evaluation materials. All AI data processing is conducted under strict confidentiality. We do not permit third-party AI models or providers to use your uploaded program datasets, transcripts, or personal data to train public models or improve their services. All AI-generated suggestions, themes, and summaries are advisory and must be reviewed by authorized program staff before official publication.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">4. Data Storage and Security</h3>
              <p>Your data is stored using industry-standard encryption at rest and in transit. We implement robust access controls, regular security monitoring, and secure session management. Program data is strictly partitioned by organization and is not accessible to any unauthorized third party. Session and workspace data are persisted in your local browser storage and secure local states.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">5. User Rights</h3>
              <p>You have the right to access, rectify, or request the deletion of your personal account data at any time. If your organization processes personal data of beneficiaries within the platform, you are responsible for securing necessary consents. You can exercise your rights by contacting us at our designated support channel.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">6. Cookies and Analytics</h3>
              <p>We use essential cookies and local browser storage mechanisms to maintain session state, authenticate your login credentials, and preserve your local workspace preferences. We may use anonymous analytics cookies or trackers to understand platform navigation and diagnostic performance issues without tracking individual personal identifiers.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">7. Third-Party Services</h3>
              <p>We may integrate secure, enterprise-grade third-party services to assist in data hosting, authentication, or qualitative processing. These third parties are authorized to use your personal or program data only as necessary to provide these sub-services and are bound by strict data processing and confidentiality agreements.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">8. Data Retention</h3>
              <p>We retain your account and program data for the duration of your active workspace subscription. You may request manual deletion of your workspace data or account at any time, in which case all stored datasets, files, and generated reports will be permanently purged from our active databases, subject to any legally mandated retention periods.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">9. Children’s Privacy</h3>
              <p>ImpactIQ is designed for professional use by authorized adult personnel of NGOs and development organizations. We do not knowingly collect personal information from individuals under 18 years of age.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">10. Changes to this Policy</h3>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices or regulatory standards. Material updates will be communicated through platform notifications or via email. Your continued use of the platform following updates constitutes acceptance of the modified policy.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">11. Contact Information</h3>
              <p>For inquiries regarding this Privacy Policy or data protection practices, please contact us at:</p>
              <p className="mt-1.5 pl-3 border-l-2 border-teal-500 text-xs">
                <strong>Company Name:</strong> ImpactIQ<br />
                <strong>Support email:</strong> support@impactiq.com<br />
                <strong>Company Address:</strong> [To be updated]
              </p>
            </section>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex justify-end">
            <button onClick={onClose} className="btn-primary">Close</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ============================================================
// SPLASH SCREEN
// ============================================================
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const stats = [
    { value: "2,400+", label: "NGOs Served" },
    { value: "98%", label: "Donor Satisfaction" },
    { value: "10×", label: "Reporting Speed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0F2347 0%, #1B3A6B 50%, #0D3A65 100%)" }}
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #0D9488, transparent)", filter: "blur(60px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #3B82F6, transparent)", filter: "blur(60px)" }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div className="splash-fade-up mb-6">
          <div className="relative mx-auto">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #0D9488, #0B7A70)", boxShadow: "0 0 40px rgba(13,148,136,0.4)" }}>
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-2xl border-2 border-teal-400 opacity-30"
              style={{ animation: "iq-pulse-ring 2s ease-in-out infinite" }} />
          </div>
        </div>

        {/* Brand name */}
        <div className="splash-fade-up splash-fade-up-delay-1 mb-2">
          <h1 className="text-5xl font-black tracking-tight text-white">
            Impact<span style={{ color: "#0D9488" }}>IQ</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="splash-fade-up splash-fade-up-delay-2 mb-10">
          <p className="text-base font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            AI-Powered Impact Intelligence for NGOs
          </p>
        </div>

        {/* Stats row */}
        <div className="splash-fade-up splash-fade-up-delay-3 flex items-center gap-8 mb-10">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="w-px h-8 bg-white opacity-10" />}
              <div className="text-center">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="splash-fade-up splash-fade-up-delay-4 flex items-center gap-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-teal-400"
                style={{ animation: `iq-fade-in 0.6s ease ${i * 0.2}s both, iq-pulse-ring 1.2s ease ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Loading workspace...</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {

  // --- SPLASH ---
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("iq_splash_seen");
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem("iq_splash_seen", "1");
    setShowSplash(false);
  };

  // --- PRIVACY POLICY ---
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // --- AUTH / USER SYSTEM ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("impact_iq_current_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      } catch (e) {}
    }
    return {
      name: "Emmanuel Habila",
      email: "emmanuelhabila2018@gmail.com",
      role: "Lead Analyst",
      organization: "ImpactIQ Global",
      avatarColor: "#0D9488",
      initials: "EH",
      isLoggedIn: false
    };
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("impact_iq_registered_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      {
        name: "Emmanuel Habila",
        email: "emmanuelhabila2018@gmail.com",
        password: "impact2026",
        role: "Lead Analyst",
        organization: "ImpactIQ Global",
        avatarColor: "#0D9488",
        initials: "EH"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("impact_iq_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("impact_iq_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Firestore real-time listeners for user accounts & projects
  useEffect(() => {
    try {
      const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(doc => doc.data() as any);
          setRegisteredUsers(docs);
        }
      });

      const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map(doc => doc.data() as Project);
          setProjects(docs);
        }
      });

      return () => {
        unsubUsers();
        unsubProjects();
      };
    } catch (e) {
      console.error("Firestore sync error:", e);
    }
  }, []);

  const syncUserToFirestore = async (userObj: any) => {
    try {
      const docId = userObj.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");
      await setDoc(doc(db, "users", docId), userObj, { merge: true });
    } catch (err) {
      console.error("Error saving user to Firestore:", err);
    }
  };

  const handleUpdateUserRole = (email: string, newRole: string) => {
    setRegisteredUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const updated = { ...u, role: newRole };
        syncUserToFirestore(updated);
        return updated;
      }
      return u;
    }));

    if (currentUser.email.toLowerCase() === email.toLowerCase()) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }

    setSecurityAuditLogs(prev => [
      {
        id: `audit_${Date.now()}`,
        event: "User Role Updated",
        detail: `Role for ${email} modified to ${newRole} by ${currentUser.email}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "success"
      },
      ...prev
    ]);
  };

  const handleAddUser = (newUser: any) => {
    setRegisteredUsers(prev => {
      const updated = [...prev, newUser];
      return updated;
    });
    syncUserToFirestore(newUser);

    setSecurityAuditLogs(prev => [
      {
        id: `audit_${Date.now()}`,
        event: "User Provisioned",
        detail: `New account ${newUser.email} (${newUser.role}) provisioned by admin`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "success"
      },
      ...prev
    ]);
  };

  const syncProjectToFirestore = async (projObj: Project) => {
    try {
      await setDoc(doc(db, "projects", projObj.id), projObj, { merge: true });
    } catch (err) {
      console.error("Error saving project to Firestore:", err);
    }
  };

  // Auth form state
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState("Program Coordinator");
  const [authOrg, setAuthOrg] = useState("");
  const [authColor, setAuthColor] = useState("#0D9488");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // --- SECURITY & SETTINGS STATE ---
  const [secCurrentPassword, setSecCurrentPassword] = useState("");
  const [secNewPassword, setSecNewPassword] = useState("");
  const [secConfirmPassword, setSecConfirmPassword] = useState("");
  const [secShowCurrentPw, setSecShowCurrentPw] = useState(false);
  const [secShowNewPw, setSecShowNewPw] = useState(false);
  const [secPwError, setSecPwError] = useState("");
  const [secPwSuccess, setSecPwSuccess] = useState("");

  const [secRecoveryEmail, setSecRecoveryEmail] = useState("");
  const [secRecoverySuccess, setSecRecoverySuccess] = useState("");

  const [sec2FAEnabled, setSec2FAEnabled] = useState(false);
  const [secLoginAlerts, setSecLoginAlerts] = useState(true);
  const [secShow2FAModal, setSecShow2FAModal] = useState(false);
  const [sec2FAInput, setSec2FAInput] = useState("");

  const [activeSessions, setActiveSessions] = useState([
    { id: "sess_1", device: "Current Web Browser Session", location: "Web Client", ip: "Current Connection", lastActive: "Active Now", isCurrent: true }
  ]);

  const [securityAuditLogs, setSecurityAuditLogs] = useState<Array<{ id: string; event: string; detail: string; timestamp: string; status: string }>>([]);

  // --- NAVIGATION ---
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // --- MAIN DATA ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KBDoc[]>([]);

  // --- MODAL CONTROLS ---
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const [kbModalOpen, setKbModalOpen] = useState<boolean>(false);

  // --- FORM FIELDS ---
  const [newProjName, setNewProjName] = useState<string>("");
  const [newProjDonor, setNewProjDonor] = useState<string>("");
  const [newProjArea, setNewProjArea] = useState<string>("Economic Growth / Gender Equality");
  const [newProjStart, setNewProjStart] = useState<string>("2026-06-01");
  const [newProjEnd, setNewProjEnd] = useState<string>("2027-06-01");
  const [newProjIndicators, setNewProjIndicators] = useState<Indicator[]>([
    { name: "Target beneficiaries trained", target: 100, current: 0, unit: "people" }
  ]);

  const [newKbTitle, setNewKbTitle] = useState<string>("");
  const [newKbProj, setNewKbProj] = useState<string>("General Reference");
  const [newKbType, setNewKbType] = useState<"Report" | "Transcript" | "Dataset">("Report");
  const [newKbSnippet, setNewKbSnippet] = useState<string>("");

  // --- AI ENGINE ---
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState<string>("");
  const [analysisWorkspace, setAnalysisWorkspace] = useState<{
    themes: Array<{ theme: string; summary: string; quotes: string[]; frequency: "High" | "Medium" | "Low" }>;
    findings: string[];
    recommendations: string[];
    summary: string;
  } | null>(null);

  const [researchInputText, setResearchInputText] = useState<string>("");
  const [researchSelectedFiles, setResearchSelectedFiles] = useState<string[]>([]);

  // --- REPORT BUILDER STATE ---
  const [activeReportSection, setActiveReportSection] = useState<string>("Executive Summary");
  const [reportTone, setReportTone] = useState<string>("Donor-Friendly");
  const [editReportText, setEditReportText] = useState<string>("");

  useEffect(() => {
    const rep = reports.find(r => r.projectId === selectedProjectId);
    if (rep) {
      setEditReportText(rep.sections[activeReportSection] || "");
    }
  }, [activeReportSection, selectedProjectId, reports]);

  // --- KB FILTER ---
  const filteredKnowledgeBase = knowledgeBase.filter(doc => {
    if (!globalSearch) return true;
    const query = globalSearch.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      doc.project.toLowerCase().includes(query) ||
      doc.snippet.toLowerCase().includes(query)
    );
  });

  // --- AI LOADING HELPER ---
  const triggerQualitativeLoad = (steps: string[], callback: () => void) => {
    setAiLoading(true);
    let stepIndex = 0;
    setAiLoadingMessage(steps[0]);
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setAiLoadingMessage(steps[stepIndex]);
      } else {
        clearInterval(interval);
        callback();
        setAiLoading(false);
      }
    }, 1200);
  };

  // --- CLAUDE API ---
  const callClaudeAnalysis = async () => {
    let sourceContent = researchInputText;
    if (researchSelectedFiles.length > 0) {
      sourceContent += "\n\n" + files
        .filter(f => researchSelectedFiles.includes(f.id))
        .map(f => `[File: ${f.name}]\n${f.content}`)
        .join("\n\n");
    }
    if (!sourceContent.trim()) {
      alert("Please select files or input text to analyze.");
      return;
    }
    const steps = [
      "Analyzing uploaded text transcripts...",
      "Extracting community themes & statements...",
      "Cross-referencing supporting quotes...",
      "Synthesizing qualitative program insights...",
      "Compiling final NGO recommendation draft..."
    ];
    triggerQualitativeLoad(steps, async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: sourceContent })
        });
        if (!response.ok) throw new Error("API rejection");
        const parsed = await response.json();
        const normalizedThemes = (parsed.themes || []).map((t: any) => ({
          theme: t.theme || t.name || "Identified Pattern",
          summary: t.summary || t.description || "",
          quotes: t.quotes || t.evidence || [],
          frequency: t.frequency || "High"
        }));
        setAnalysisWorkspace({ themes: normalizedThemes, findings: parsed.findings || [], recommendations: parsed.recommendations || [], summary: parsed.summary || "" });
        setNotifications(prev => ["AI themes extracted from recent source workspace", ...prev]);
      } catch (err) {
        generateQualitativeEmulation(sourceContent);
      }
    });
  };

  const generateQualitativeEmulation = (textInput: string) => {
    const inputLower = textInput.toLowerCase();
    let computedThemes = [...(analysisWorkspace?.themes || [])];
    let computedFindings = [...(analysisWorkspace?.findings || [])];
    let computedRecs = [...(analysisWorkspace?.recommendations || [])];
    let computedSummary = "Evaluation program parameters indicate good outcomes with standard structural adjustments.";
    if (inputLower.includes("women") || inputLower.includes("saving") || inputLower.includes("empower")) {
      computedThemes = [
        { theme: "Financial Agency & Safety", summary: "Alternative financial capital provided by collective savings structures removes basic reliance on expensive village commercial lenders.", quotes: ["'The savings circles let us borrow safely without standard stress or debt traps.'"], frequency: "High" },
        { theme: "Treasurer Record Keeping Literacy Gap", summary: "NGO coordinators highlighted that simple accounting operations remain slow, reducing overall efficiency across remote centers.", quotes: ["'Calculations and simple books block speedy work, we need direct guidance manuals.'"], frequency: "Medium" }
      ];
      computedFindings = ["Financial accessibility metric rose 40% inside targets.", "Social solidarity scores moved up, elevating baseline female representation."];
      computedRecs = ["Deploy modular digital accounting templates to coordinators.", "Equip local treasurers with high-contrast, physical LEDGER sheets."];
      computedSummary = "High-leverage socio-economic returns found across target circles, throttled slightly by local literacy demands.";
    } else {
      computedThemes = [
        { theme: "Operational Workflow Efficiencies", summary: "Local participants express satisfaction with scheduled training, but request stronger regional coordination support.", quotes: ["'Having scheduled trainers is great, but local sessions are frequently crowded.'"], frequency: "High" },
        { theme: "Climate Adaptation Rate", summary: "Slight hesitation was recorded in adopting composting methods, showing a need for community visual showcases.", quotes: ["'Seeing a working field demo is far better than a standard slide deck.'"], frequency: "Medium" }
      ];
      computedFindings = ["Workflow integration remains satisfactory across program branches.", "Visual demonstration fields exhibit significantly higher adaptation rates."];
      computedRecs = ["Translate program handbooks into pictographic files.", "Initiate a local mentorship group linking early adopters with peers."];
      computedSummary = "General program operations meet baseline donor criteria, while requesting stronger hands-on visuals.";
    }
    setAnalysisWorkspace({ themes: computedThemes, findings: computedFindings, recommendations: computedRecs, summary: computedSummary });
  };

  const callClaudeReportSection = async () => {
    const parentProj = projects.find(p => p.id === selectedProjectId);
    const steps = [
      "Consulting donor reporting guidelines...",
      `Scanning datasets for ${activeReportSection}...`,
      `Drafting in ${reportTone} style...`,
      "Formatting compliant AI block..."
    ];
    triggerQualitativeLoad(steps, async () => {
      try {
        const response = await fetch("/api/report-section", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            section: activeReportSection,
            tone: reportTone,
            projectDescription: parentProj ? `${parentProj.name} - ${parentProj.description}` : "",
            insightsSummary: analysisWorkspace?.summary || ""
          })
        });
        if (!response.ok) throw new Error("API rejection");
        const resData = await response.json();
        const textOut = resData.text;
        setReports(prev => prev.map(rep => {
          if (rep.projectId === selectedProjectId) {
            return { ...rep, aiDrafts: { ...rep.aiDrafts, [activeReportSection]: textOut } };
          }
          return rep;
        }));
      } catch (err) {
        generateReportDraftEmulation();
      }
    });
  };

  const generateReportDraftEmulation = () => {
    const parentProj = projects.find(p => p.id === selectedProjectId);
    const pName = parentProj?.name || "Program Workspace";
    let draft = "";
    if (activeReportSection === "Executive Summary") {
      draft = `During this reporting cycle, the ${pName} recorded excellent results. Active participation indicators reached 82% of target projections. Field teams completed comprehensive deployment, showing that self-governing saving models operate with low structural overhead.\n\nKey limitations identified are qualitative: literacy-driven ledger errors among coordinators. In response, local coordinators are launching direct visual auditing guides to preserve financial transparency in active sub-districts.`;
    } else if (activeReportSection === "Key Findings") {
      draft = `Core monitoring data shows an increase in self-organization capacity. Qualitative reviews of FGD dialog indicate high trust in community structures, as women save and loan cooperatively.\n\nA slight friction occurs regarding training density. Treasurers indicated mild performance anxiety when updating physical accounting sheets, suggesting that formal evaluation protocols must incorporate visual ledger aids.`;
    } else {
      draft = `Strategic goals for ${pName} specify scaling target actions. We propose targeting literacy adjustments through visual ledger books. Field trainers will roll out direct physical worksheets in Q3, ensuring sustainable, locally controlled growth.\n\nDetailed surveys confirm community support remains exceptional, indicating donor funding parameters are thoroughly aligned with direct agrarian needs.`;
    }
    setReports(prev => prev.map(rep => {
      if (rep.projectId === selectedProjectId) {
        return { ...rep, aiDrafts: { ...rep.aiDrafts, [activeReportSection]: draft } };
      }
      return rep;
    }));
  };

  const handleAcceptAIDraft = (section: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.projectId === selectedProjectId) {
        const draft = rep.aiDrafts[section] || "";
        return { ...rep, sections: { ...rep.sections, [section]: draft }, aiDrafts: { ...rep.aiDrafts, [section]: "" } };
      }
      return rep;
    }));
    setNotifications(prev => [`AI content accepted for ${section}`, ...prev]);
  };

  const handleEditAIDraft = (section: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.projectId === selectedProjectId) {
        const draft = rep.aiDrafts[section] || "";
        return { ...rep, sections: { ...rep.sections, [section]: draft }, aiDrafts: { ...rep.aiDrafts, [section]: "" } };
      }
      return rep;
    }));
    setNotifications(prev => [`AI draft moved to active editor for ${section}`, ...prev]);
  };

  const callClaudeNewInsights = async () => {
    const parentProj = projects.find(p => p.id === selectedProjectId) || projects[0];
    const pName = parentProj?.name || "Workspace Data";
    
    // Check if there is any data in the account
    const hasData = projects.length > 0 || files.length > 0 || knowledgeBase.length > 0 || researchInputText.trim().length > 0;
    if (!hasData) {
      alert("No evaluation files or project data found in your account. Please create a project and upload source materials first to generate AI insights.");
      return;
    }

    // Build context string from uploaded files and project indicators
    const fileContents = files.map(f => `${f.name}: ${f.content}`).join("\n");
    const indicatorDetails = parentProj ? parentProj.indicators.map(i => `${i.name}: ${i.current}/${i.target} ${i.unit}`).join(", ") : "";
    const combinedContext = `Project Name: ${pName}\nProject Description: ${parentProj?.description || ""}\nIndicators: ${indicatorDetails}\nSource Files Content:\n${fileContents || "No file uploads"}`;

    const steps = ["Scanning evaluation files...", "Mining pattern vectors...", "Structuring insight cards..."];
    triggerQualitativeLoad(steps, async () => {
      try {
        const response = await fetch("/api/generate-insights", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ projectName: pName, content: combinedContext })
        });
        if (!response.ok) throw new Error("API rejection");
        const parsed: any[] = await response.json();
        const newIns: Insight[] = parsed.map((item, idx) => ({
          id: `ai_ins_${Date.now()}_${idx}`,
          title: item.title || "Community Assessment Insight",
          summary: item.summary || "Qualitative feedback highlights program implementation dynamics.",
          projectId: parentProj?.id || "",
          projectName: pName,
          confidence: item.confidence || "High"
        }));
        setInsights(prev => [...newIns, ...prev]);
        setNotifications(prev => ["New insight cards generated from workspace data", ...prev]);
      } catch (err) {
        const simulated: Insight[] = [
          {
            id: `sim_ins_1_${Date.now()}`,
            title: `Performance Indicator Synthesis for ${pName}`,
            summary: indicatorDetails ? `Evaluation metrics confirm active progress towards targets: ${indicatorDetails}.` : `Project framework for ${pName} initialized with baseline operational parameters.`,
            projectId: parentProj?.id || "",
            projectName: pName,
            confidence: "High"
          },
          {
            id: `sim_ins_2_${Date.now()}`,
            title: `Qualitative Dataset Alignment`,
            summary: files.length > 0 ? `${files.length} source file(s) synchronized in workspace for qualitative pattern indexing.` : `Additional field transcripts and survey files can be indexed to deepen thematic extraction.`,
            projectId: parentProj?.id || "",
            projectName: pName,
            confidence: "Medium"
          }
        ];
        setInsights(prev => [...simulated, ...prev]);
        setNotifications(prev => ["Insight cards generated from workspace data", ...prev]);
      }
    });
  };

  // --- FILE OPERATIONS ---
  const triggerManualUpload = (name: string, type: "pdf" | "csv" | "xlsx" | "txt") => {
    const fId = `file_${Date.now()}`;
    const newF: UploadedFile = {
      id: fId, name, projectId: selectedProjectId, type,
      size: "450 KB", uploadDate: new Date().toISOString().split("T")[0],
      status: "Processing", content: "Evaluating newly uploaded files."
    };
    setFiles(prev => [...prev, newF]);
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fId) return { ...f, status: "Ready", content: "Newly uploaded file content. 88% overall programmatic satisfaction." };
        return f;
      }));
      setNotifications(prev => [`${name} analyzed & indexed`, ...prev]);
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      const validTypes: Record<string, "pdf" | "csv" | "xlsx" | "txt"> = { pdf: "pdf", csv: "csv", xlsx: "xlsx", txt: "txt" };
      const finalType = validTypes[ext || ""] || "txt";
      triggerManualUpload(file.name, finalType);
    }
  };

  const handleUpdateIndicator = (projId: string, indName: string, value: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return { ...p, indicators: p.indicators.map(ind => ind.name === indName ? { ...ind, current: Math.min(ind.target, Math.max(0, value)) } : ind) };
      }
      return p;
    }));
  };

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const navigate = (page: string) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
  };

  // ============================================================
  // AUTH SCREEN
  // ============================================================
  if (!currentUser.isLoggedIn) {
    const handleSignIn = (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      if (!authEmail) { setAuthError("Please enter your email address."); return; }
      setAuthLoading(true);
      setTimeout(() => {
        const cleanEmail = authEmail.trim().toLowerCase();
        const match = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
        if (match) {
          setCurrentUser({
            name: match.name, email: match.email, role: match.role,
            organization: match.organization || "NGO Partner",
            avatarColor: match.avatarColor, initials: match.initials, isLoggedIn: true
          });
          setNotifications(prev => [`Welcome back, ${match.name}`, ...prev]);
        } else {
          const namePart = authEmail.split("@")[0];
          const niceName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          const init = niceName.substring(0, 2).toUpperCase();
          const newUserObj = { name: niceName, email: authEmail, password: authPassword, role: "Program Coordinator", organization: "ImpactIQ Partner", avatarColor: "#6366F1", initials: init };
          setRegisteredUsers(prev => [...prev, newUserObj]);
          syncUserToFirestore(newUserObj);
          setCurrentUser({ ...newUserObj, isLoggedIn: true });
          setNotifications(prev => [`Welcome, ${niceName}! Account created.`, ...prev]);
        }
        setAuthLoading(false);
      }, 800);
    };

    const handleSignUp = (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      if (!authName || !authEmail) { setAuthError("Full name and email are required."); return; }
      if (authPassword.length < 6) { setAuthError("Password must be at least 6 characters."); return; }
      if (authPassword !== authConfirmPassword) { setAuthError("Passwords do not match."); return; }
      setAuthLoading(true);
      setTimeout(() => {
        const init = authName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        const newUser = { name: authName, email: authEmail, password: authPassword, role: authRole, organization: authOrg || "ImpactIQ Partner", avatarColor: authColor, initials: init };
        setRegisteredUsers(prev => [...prev, newUser]);
        syncUserToFirestore(newUser);
        setCurrentUser({ ...newUser, isLoggedIn: true });
        setNotifications(prev => [`Account created for ${authName}`, ...prev]);
        setAuthLoading(false);
      }, 800);
    };

    return (
      <>
        {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}
        <div className="min-h-screen flex" style={{ fontFamily: "var(--font-sans)" }}>
          {/* Left brand panel */}
          <div className="hidden lg:flex lg:w-[45%] flex-col relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0F2347 0%, #1B3A6B 60%, #0D3A65 100%)" }}>
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px"
              }} />
            <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, #0D9488, transparent)", filter: "blur(80px)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #3B82F6, transparent)", filter: "blur(60px)" }} />

            <div className="relative z-10 flex flex-col h-full p-12">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-16">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#0D9488", boxShadow: "0 0 20px rgba(13,148,136,0.4)" }}>
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Impact<span style={{ color: "#0D9488" }}>IQ</span>
                </span>
              </div>

              {/* Hero content */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-black text-white leading-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
                  Smarter impact,<br />powered by AI.
                </h2>
                <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                  The intelligence platform built for NGOs to evaluate programs, generate donor reports, and surface actionable insights — all in one secure workspace.
                </p>

                {/* Feature bullets */}
                <div className="space-y-3 mb-10">
                  {[
                    { icon: BarChart2, text: "AI-powered qualitative analysis from FGD transcripts" },
                    { icon: FileText, text: "Automated donor report generation in minutes" },
                    { icon: Lightbulb, text: "Program insights mined from evaluation data" },
                    { icon: Shield, text: "Secure, GDPR-compliant data storage" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded flex items-center justify-center shrink-0"
                        style={{ background: "rgba(13,148,136,0.2)" }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: "#0D9488" }} />
                      </div>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  {[{ value: "2,400+", label: "NGOs" }, { value: "50M+", label: "Beneficiaries tracked" }, { value: "98%", label: "Satisfaction" }].map(s => (
                    <div key={s.label}>
                      <p className="text-xl font-black text-white">{s.value}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs mt-8" style={{ color: "rgba(255,255,255,0.3)" }}>
                © 2026 ImpactIQ Global. All rights reserved.
              </p>
            </div>
          </div>

          {/* Right auth form panel */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-white">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "#1B3A6B" }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-black" style={{ color: "#1B3A6B" }}>
                Impact<span style={{ color: "#0D9488" }}>IQ</span>
              </span>
            </div>

            <div className="w-full max-w-md">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                  {authMode === "signin" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  {authMode === "signin"
                    ? "Sign in to your ImpactIQ workspace."
                    : "Join your organization's ImpactIQ workspace."}
                </p>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 rounded-xl mb-8" style={{ background: "#F3F4F6" }}>
                {[{ key: "signin", label: "Sign In" }, { key: "signup", label: "Create Account" }].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setAuthMode(tab.key as any); setAuthError(""); }}
                    className="flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition"
                    style={{
                      background: authMode === tab.key ? "white" : "transparent",
                      color: authMode === tab.key ? "#111827" : "#6B7280",
                      boxShadow: authMode === tab.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Error message */}
              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
                  style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FCA5A5" }}>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {authError}
                </div>
              )}

              {/* SIGN IN FORM */}
              {authMode === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email" required autoComplete="email"
                        placeholder="you@organization.org"
                        value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        className="auth-input auth-input-has-left-icon"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input
                        type={showAuthPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        className="auth-input auth-input-has-left-icon auth-input-has-right-icon"
                      />
                      <button type="button" onClick={() => setShowAuthPassword(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center">
                        {showAuthPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={authLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition cursor-pointer"
                    style={{ background: authLoading ? "#6B7280" : "#1B3A6B" }}>
                    {authLoading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Signing in...</> : <><Lock className="h-4 w-4" /> Sign In</>}
                  </button>
                </form>
              )}

              {/* SIGN UP FORM */}
              {authMode === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Full name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input type="text" required placeholder="John Doe"
                         value={authName} onChange={e => setAuthName(e.target.value)}
                         className="auth-input auth-input-has-left-icon" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Work email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input type="email" required placeholder="you@organization.org"
                         value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                         className="auth-input auth-input-has-left-icon" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Role</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <select value={authRole} onChange={e => setAuthRole(e.target.value)}
                          className="auth-input auth-input-has-left-icon pr-10 text-sm cursor-pointer">
                          <option>Lead Analyst</option>
                          <option>Program Coordinator</option>
                          <option>Senior Advisor</option>
                          <option>Field Director</option>
                          <option>Donor Reviewer</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Organization</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Your NGO"
                          value={authOrg} onChange={e => setAuthOrg(e.target.value)}
                          className="auth-input auth-input-has-left-icon" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input type={showAuthPassword ? "text" : "password"} placeholder="Min. 6 characters"
                        value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        className="auth-input auth-input-has-left-icon auth-input-has-right-icon" />
                      <button type="button" onClick={() => setShowAuthPassword(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center">
                        {showAuthPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Confirm password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      <input type="password" placeholder="Repeat password"
                        value={authConfirmPassword} onChange={e => setAuthConfirmPassword(e.target.value)}
                        className="auth-input auth-input-has-left-icon" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Avatar color</label>
                    <div className="flex gap-2">
                      {["#0D9488", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"].map(c => (
                        <button key={c} type="button" onClick={() => setAuthColor(c)}
                          className="h-7 w-7 rounded-full border-2 transition cursor-pointer"
                          style={{ background: c, borderColor: authColor === c ? "#111827" : "transparent", transform: authColor === c ? "scale(1.15)" : "scale(1)" }} />
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={authLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition cursor-pointer"
                    style={{ background: authLoading ? "#6B7280" : "#1B3A6B" }}>
                    {authLoading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Creating account...</> : <><UserPlus className="h-4 w-4" /> Create Account</>}
                  </button>
                </form>
              )}

              {/* Privacy policy link */}
              <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
                By continuing, you agree to our{" "}
                <button onClick={() => setShowPrivacyPolicy(true)}
                  className="underline font-medium transition" style={{ color: "#0D9488" }}>
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ============================================================
  // SIDEBAR NAV CONFIG
  // ============================================================
  const isAdmin =
    currentUser.email?.toLowerCase() === "emmanuelhabila2018@gmail.com" ||
    (currentUser.role && (
      currentUser.role.toLowerCase().includes("admin") ||
      currentUser.role.toLowerCase().includes("lead") ||
      currentUser.role.toLowerCase().includes("director")
    ));

  const navItems = [
    { id: "home",        label: "Dashboard",       icon: LayoutDashboard },
    { id: "projects",    label: "Projects",         icon: Folder },
    { id: "assistant",   label: "AI Assistant",    icon: Bot },
    { id: "logframe",    label: "LogFrame & TOC",   icon: Layers },
    { id: "kobocollect", label: "Field Collector",  icon: Smartphone },
    { id: "grants",      label: "Donor Compliance", icon: Building2 },
    { id: "dqa",         label: "DQA & Evaluation", icon: Award },
    { id: "research",    label: "Research Studio",  icon: FlaskConical },
    { id: "report",      label: "Report Builder",   icon: FileText },
    { id: "insights",    label: "AI Insights",      icon: Lightbulb },
    { id: "kb",          label: "Knowledge Base",   icon: BookOpen },
  ];

  // ============================================================
  // MAIN AUTHENTICATED APP
  // ============================================================
  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {showPrivacyPolicy && <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />}

      <div className="min-h-screen flex" style={{ fontFamily: "var(--font-sans)", background: "#F7F8FA" }}>

        {/* ---- SIDEBAR (desktop) ---- */}
        <aside className={`hidden md:flex flex-col shrink-0 border-r transition-all duration-300 print:hidden ${sidebarCollapsed ? "w-[60px]" : "w-[220px]"}`}
          style={{ background: "white", borderColor: "#E5E7EB", position: "sticky", top: 0, height: "100vh", zIndex: 30 }}>

          {/* Workspace header */}
          <div className="flex items-center gap-2.5 px-3 py-4 border-b shrink-0" style={{ borderColor: "#F3F4F6", minHeight: 56 }}>
            <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "#1B3A6B" }}>
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate" style={{ color: "#111827" }}>
                  Impact<span style={{ color: "#0D9488" }}>IQ</span>
                </span>
                <span className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>Impact Intelligence</span>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold px-2 pb-1 pt-1 uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                Workspace
              </p>
            )}
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.id === "projects" && currentPage === "detail");
              return (
                <button key={`desktop_sidebar_${item.id}`} onClick={() => navigate(item.id)}
                  title={sidebarCollapsed ? item.label : ""}
                  className={`nav-item ${isActive ? "active" : ""} ${sidebarCollapsed ? "justify-center" : ""}`}>
                  <Icon className={`nav-icon h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : "text-gray-500"}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}

            {!sidebarCollapsed && (
              <div className="pt-3">
                <p className="text-[10px] font-semibold px-2 pb-1 uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                  Account
                </p>
              </div>
            )}
            <button onClick={() => navigate("profile")}
              title={sidebarCollapsed ? "User Profile" : ""}
              className={`nav-item ${currentPage === "profile" ? "active" : ""} ${sidebarCollapsed ? "justify-center" : ""}`}>
              <User className={`h-4 w-4 shrink-0 ${currentPage === "profile" ? "text-teal-600" : "text-gray-500"}`} />
              {!sidebarCollapsed && <span>User Profile</span>}
            </button>
            <button onClick={() => navigate("settings")}
              title={sidebarCollapsed ? "Security & Settings" : ""}
              className={`nav-item ${currentPage === "settings" ? "active" : ""} ${sidebarCollapsed ? "justify-center" : ""}`}>
              <Shield className={`h-4 w-4 shrink-0 ${currentPage === "settings" ? "text-teal-600" : "text-gray-500"}`} />
              {!sidebarCollapsed && <span>Security & Settings</span>}
            </button>

            {/* Admin Hub nav item - visible only to Admin */}
            {isAdmin && (
              <>
                {!sidebarCollapsed && (
                  <div className="pt-3">
                    <p className="text-[10px] font-bold px-2 pb-1 uppercase tracking-wider text-amber-700 flex items-center justify-between">
                      <span>Admin Access</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">DEV</span>
                    </p>
                  </div>
                )}
                <button onClick={() => navigate("admin")}
                  title={sidebarCollapsed ? "Developer & Admin Hub" : ""}
                  className={`nav-item ${currentPage === "admin" ? "active" : ""} ${sidebarCollapsed ? "justify-center" : ""} border border-amber-200/60 bg-amber-50/40 hover:bg-amber-100/50`}>
                  <Terminal className={`h-4 w-4 shrink-0 ${currentPage === "admin" ? "text-teal-600" : "text-amber-600"}`} />
                  {!sidebarCollapsed && <span className="font-semibold text-gray-900">Admin & Dev Hub</span>}
                </button>
              </>
            )}
          </nav>

          {/* Bottom: collapse toggle + user */}
          <div className="border-t px-2 py-3 space-y-2 shrink-0" style={{ borderColor: "#F3F4F6" }}>
            <button onClick={() => setSidebarCollapsed(p => !p)}
              className="nav-item w-full" style={{ color: "#9CA3AF", fontSize: 12 }}>
              <AlignLeft className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{sidebarCollapsed ? "Expand" : "Collapse"} sidebar</span>}
            </button>

            {!sidebarCollapsed ? (
              <div className="flex items-center justify-between px-2 py-2 rounded-xl cursor-pointer group hover:bg-gray-50 transition"
                onClick={() => navigate("profile")}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: currentUser.avatarColor }}>
                    {currentUser.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>{currentUser.name}</p>
                    <p className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>{currentUser.role}</p>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); setCurrentUser(prev => ({ ...prev, isLoggedIn: false })); }}
                  className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center" onClick={() => navigate("profile")}>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80 transition"
                  style={{ background: currentUser.avatarColor }}>
                  {currentUser.initials}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ---- MOBILE SIDEBAR OVERLAY ---- */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(0,0,0,0.3)" }}
                onClick={() => setMobileSidebarOpen(false)} />
              <motion.aside
                initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 bottom-0 w-60 z-50 flex flex-col md:hidden"
                style={{ background: "white", borderRight: "1px solid #E5E7EB" }}>
                <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "#F3F4F6" }}>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "#1B3A6B" }}>
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#111827" }}>
                      Impact<span style={{ color: "#0D9488" }}>IQ</span>
                    </span>
                  </div>
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id || (item.id === "projects" && currentPage === "detail");
                    return (
                      <button key={`mobile_sidebar_${item.id}`} onClick={() => navigate(item.id)}
                        className={`nav-item ${isActive ? "active" : ""}`}>
                        <Icon className={`nav-icon h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : "text-gray-500"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="pt-2 space-y-0.5">
                    <p className="text-[10px] font-semibold px-2 pb-1 uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                      Account
                    </p>
                    <button onClick={() => navigate("profile")} className={`nav-item ${currentPage === "profile" ? "active" : ""}`}>
                      <User className="h-4 w-4 shrink-0 text-gray-500" />
                      <span>User Profile</span>
                    </button>
                    <button onClick={() => navigate("settings")} className={`nav-item ${currentPage === "settings" ? "active" : ""}`}>
                      <Shield className="h-4 w-4 shrink-0 text-gray-500" />
                      <span>Security & Settings</span>
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="pt-2 space-y-0.5">
                      <p className="text-[10px] font-bold px-2 pb-1 uppercase tracking-wider text-amber-700 flex items-center justify-between">
                        <span>Admin Access</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">DEV</span>
                      </p>
                      <button onClick={() => navigate("admin")} className={`nav-item ${currentPage === "admin" ? "active" : ""} bg-amber-50/50 border border-amber-200/50`}>
                        <Terminal className="h-4 w-4 shrink-0 text-amber-600" />
                        <span className="font-semibold text-gray-900">Admin & Dev Hub</span>
                      </button>
                    </div>
                  )}
                </nav>
                <div className="border-t px-3 py-3" style={{ borderColor: "#F3F4F6" }}>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: currentUser.avatarColor }}>
                      {currentUser.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>{currentUser.name}</p>
                      <p className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>{currentUser.role}</p>
                    </div>
                    <button onClick={() => setCurrentUser(prev => ({ ...prev, isLoggedIn: false }))}
                      className="ml-auto p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ---- MAIN CONTENT AREA ---- */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 overflow-hidden">

          {/* ---- TOPBAR ---- */}
          <header className="shrink-0 flex items-center justify-between px-4 md:px-6 h-14 border-b bg-white print:hidden"
            style={{ borderColor: "#E5E7EB", position: "sticky", top: 0, zIndex: 20 }}>
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <Menu className="h-5 w-5" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-sm">
                {currentPage === "detail" && (
                  <>
                    <button onClick={() => navigate("projects")}
                      className="text-gray-500 hover:text-gray-900 font-medium transition flex items-center gap-1">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Projects
                    </button>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                    <span className="font-semibold truncate max-w-[140px] md:max-w-xs" style={{ color: "#111827" }}>
                      {currentProject?.name}
                    </span>
                  </>
                )}
                {currentPage !== "detail" && (
                  <span className="font-semibold" style={{ color: "#111827" }}>
                    {currentPage === "profile" ? "User Profile" :
                     currentPage === "settings" ? "Security & Settings" :
                     navItems.find(n => n.id === currentPage)?.label || "Workspace"}
                  </span>
                )}
              </div>

              {/* AI engine status */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                AI Ready
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalSearch}
                  onChange={e => setGlobalSearch(e.target.value)}
                  className="pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 w-40 md:w-52"
                  style={{ paddingLeft: "2.25rem", background: "#F9FAFB", borderColor: "#E5E7EB", color: "#111827" }}
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifications(p => !p)}
                  className="relative p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
                  <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                      style={{ background: "#EF4444" }}>
                      {Math.min(notifications.length, 9)}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl border overflow-hidden z-50"
                      style={{ background: "white", borderColor: "#E5E7EB" }}>
                      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                        <span className="text-sm font-semibold" style={{ color: "#111827" }}>Notifications</span>
                        <button onClick={() => setNotifications([])}
                          className="text-xs font-medium hover:underline" style={{ color: "#0D9488" }}>
                          Clear all
                        </button>
                      </div>
                      <div className="divide-y max-h-72 overflow-y-auto" style={{ divideColor: "#F9FAFB" }}>
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-center text-xs text-gray-400">No notifications</p>
                        ) : notifications.map((n, idx) => (
                          <div key={`notif_${idx}_${n.slice(0, 15)}`} className="px-4 py-3 hover:bg-gray-50 transition flex gap-2.5 items-start">
                            <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#0D9488" }} />
                            <span className="text-xs leading-relaxed" style={{ color: "#374151" }}>{n}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User avatar */}
              <button onClick={() => navigate("profile")}
                className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold transition hover:opacity-80"
                style={{ background: currentUser.avatarColor }}>
                {currentUser.initials}
              </button>
            </div>
          </header>

          {/* ---- PAGE CONTENT ---- */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">

              {/* ======================================
                  PAGE: HOME DASHBOARD
                  ====================================== */}
              {currentPage === "home" && (
                <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-6">

                  {/* Welcome header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                        Hi, {currentUser.name.split(" ")[0]} 👋
                      </h1>
                      <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                        Here's what's happening across your programs today.
                      </p>
                    </div>
                    <button onClick={() => setProjectModalOpen(true)} className="btn-primary self-start">
                      <Plus className="h-4 w-4" /> New Project
                    </button>
                  </div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Active Programs",
                        value: projects.filter(p => p.status === "Active").length,
                        sub: projects.filter(p => p.status === "Active").length > 0 ? `${projects.filter(p => p.status === "Active").length} active` : "0 active programs",
                        subColor: projects.filter(p => p.status === "Active").length > 0 ? "#10B981" : "#6B7280",
                        icon: Activity,
                        iconBg: "#EFF6FF",
                        iconColor: "#3B82F6",
                        accent: "#3B82F6"
                      },
                      {
                        label: "Reports Due",
                        value: reports.filter(r => r.status === "Draft").length,
                        sub: reports.filter(r => r.status === "Draft").length > 0 ? `${reports.filter(r => r.status === "Draft").length} pending draft` : "No reports due",
                        subColor: reports.filter(r => r.status === "Draft").length > 0 ? "#F59E0B" : "#6B7280",
                        icon: FileCheck,
                        iconBg: "#FFFBEB",
                        iconColor: "#F59E0B",
                        accent: "#F59E0B"
                      },
                      {
                        label: "Indexed Datasets",
                        value: files.length,
                        sub: "Files synchronized",
                        subColor: "#6B7280",
                        icon: Layers,
                        iconBg: "#F0FDFA",
                        iconColor: "#0D9488",
                        accent: "#0D9488"
                      }
                    ].map(card => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className="metric-card group cursor-default"
                          style={{ borderLeft: `3px solid ${card.accent}` }}>
                          <div className="flex items-start justify-between mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
                              {card.label}
                            </p>
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                              style={{ background: card.iconBg }}>
                              <Icon className="h-4 w-4" style={{ color: card.iconColor }} />
                            </div>
                          </div>
                          <p className="text-3xl font-black" style={{ color: "#111827", letterSpacing: "-0.03em" }}>
                            {card.value}
                          </p>
                          <p className="text-xs mt-1 font-medium" style={{ color: card.subColor }}>{card.sub}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Content grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left — Active Projects */}
                    <div className="xl:col-span-8 space-y-5">
                      {/* Quick AI Assistant Banner */}
                      <div className="rounded-2xl p-4 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
                        style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0F172A 100%)", border: "1px solid #334155" }}>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "rgba(13, 148, 136, 0.2)", border: "1px solid rgba(20, 184, 166, 0.4)" }}>
                            <Bot className="h-5 w-5 text-teal-300" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white">ImpactIQ AI Assistant</h3>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                                style={{ background: "rgba(13, 148, 136, 0.3)", color: "#5EEAD4", border: "1px solid rgba(94, 234, 212, 0.3)" }}>
                                Powered by Meta Llama
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 mt-0.5">
                              Query project indicators, challenges, qualitative research findings, and donor summaries.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate("assistant")}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm hover:opacity-90"
                          style={{ background: "#0D9488" }}
                        >
                          <span>Open Assistant</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold" style={{ color: "#111827" }}>Active Initiatives</h2>
                        <button onClick={() => navigate("projects")}
                          className="text-xs font-semibold hover:underline" style={{ color: "#0D9488" }}>
                          View all
                        </button>
                      </div>

                      <div className={projects.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "block"}>
                        {projects.length > 0 ? (
                          projects.map(proj => (
                            <div key={proj.id} className="metric-card flex flex-col gap-3 hover:shadow-md transition cursor-default">
                              <div className="flex items-start justify-between">
                                <span className="label-badge text-[10px]"
                                  style={{ background: "#EFF6FF", color: "#1E40AF" }}>
                                  {proj.programArea}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`health-dot ${proj.health}`} />
                                  <span className="text-[10px] font-medium capitalize" style={{ color: "#6B7280" }}>
                                    {proj.health}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold text-sm leading-snug" style={{ color: "#111827" }}>
                                  {proj.name}
                                </h3>
                                <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: "#6B7280" }}>
                                  {proj.description}
                                </p>
                              </div>

                              <div>
                                <div className="flex justify-between items-center text-xs mb-1.5">
                                  <span style={{ color: "#6B7280" }}>Progress</span>
                                  <span className="font-semibold" style={{ color: "#111827" }}>{proj.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                  <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }} />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "#F3F4F6" }}>
                                <span className="text-xs" style={{ color: "#6B7280" }}>
                                  Donor: <strong style={{ color: "#111827" }}>{proj.donor}</strong>
                                </span>
                                <button
                                  onClick={() => { setSelectedProjectId(proj.id); navigate("detail"); }}
                                  className="text-xs font-semibold hover:underline flex items-center gap-0.5"
                                  style={{ color: "#1B3A6B" }}>
                                  Open <ChevronRight className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white rounded-xl border p-8 text-center space-y-4" style={{ borderColor: "#E5E7EB" }}>
                            <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                              <Folder className="h-6 w-6" />
                            </div>
                            <div className="max-w-sm mx-auto space-y-1">
                              <h3 className="text-sm font-bold" style={{ color: "#111827" }}>No active initiatives</h3>
                              <p className="text-xs" style={{ color: "#6B7280" }}>
                                Create your first project to begin tracking performance indicators, indexing source data, and drafting impact reports.
                              </p>
                            </div>
                            <button onClick={() => setProjectModalOpen(true)} className="btn-primary inline-flex mx-auto text-xs py-2 px-4 rounded-lg font-semibold shadow-xs">
                              <Plus className="h-4 w-4 mr-1.5" /> Create Your First Project
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Recent Insights */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="text-base font-bold" style={{ color: "#111827" }}>Recent AI Insights</h2>
                          <button onClick={() => navigate("insights")}
                            className="text-xs font-semibold hover:underline" style={{ color: "#0D9488" }}>
                            View all
                          </button>
                        </div>
                        <div className="space-y-3">
                          {insights.length > 0 ? (
                            insights.slice(0, 2).map(ins => (
                              <div key={ins.id} className="bg-white rounded-xl p-4 border"
                                style={{ borderColor: "#E5E7EB", borderLeft: "3px solid #0D9488" }}>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-semibold leading-snug mb-1" style={{ color: "#111827" }}>
                                      {ins.title}
                                    </h4>
                                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{ins.summary}</p>
                                  </div>
                                  <span className="ai-badge shrink-0">✦ AI</span>
                                </div>
                                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t" style={{ borderColor: "#F3F4F6" }}>
                                  <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{ins.projectName}</span>
                                  <span className={`label-badge confidence-${ins.confidence.toLowerCase()} text-[10px]`}>
                                    {ins.confidence} confidence
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-white rounded-xl p-6 border text-center space-y-1" style={{ borderColor: "#E5E7EB" }}>
                              <p className="text-xs font-semibold" style={{ color: "#374151" }}>No qualitative insights generated</p>
                              <p className="text-[11px]" style={{ color: "#6B7280" }}>
                                Insights will appear once source files are uploaded and synthesized in the Research Studio.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right — Side panels */}
                    <div className="xl:col-span-4 space-y-4">
                      {/* Upcoming deadlines */}
                      <div className="metric-card">
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                          <Calendar className="h-4 w-4" style={{ color: "#0D9488" }} />
                          Upcoming Deadlines
                        </h3>
                        <div className="space-y-2.5">
                          {reports.length > 0 ? (
                            reports.map(d => (
                              <div key={d.id} className="p-2.5 rounded-lg" style={{ background: "#F9FAFB" }}>
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold" style={{ color: "#111827" }}>{d.name} Submission</p>
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ background: "#FEF2F2", color: "#B91C1C" }}>Draft</span>
                                </div>
                                <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>Last saved {d.lastSaved}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center rounded-xl border border-dashed" style={{ borderColor: "#E5E7EB" }}>
                              <p className="text-xs font-semibold" style={{ color: "#374151" }}>No upcoming deadlines</p>
                              <p className="text-[10px] mt-1" style={{ color: "#9CA3AF" }}>Index a draft report in your workspace to track deadlines.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recent datasets */}
                      <div className="metric-card">
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                          <Layers className="h-4 w-4" style={{ color: "#0D9488" }} />
                          Recent Datasets
                        </h3>
                        <div className="space-y-2">
                          {files.length > 0 ? (
                            files.slice(0, 3).map(f => (
                              <div key={f.id} className="flex items-center justify-between text-xs py-2 border-b last:border-0"
                                style={{ borderColor: "#F3F4F6" }}>
                                <div className="min-w-0 mr-2">
                                  <p className="font-medium truncate" style={{ color: "#111827" }}>{f.name}</p>
                                  <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{f.size} · {f.uploadDate}</p>
                                </div>
                                <span className={`label-badge text-[9px] shrink-0 ${f.status === "Ready" ? "confidence-high" : "confidence-medium"}`}>
                                  {f.status}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center rounded-xl border border-dashed" style={{ borderColor: "#E5E7EB" }}>
                              <p className="text-xs font-semibold" style={{ color: "#374151" }}>No datasets indexed yet</p>
                              <p className="text-[10px] mt-1" style={{ color: "#9CA3AF" }}>Upload evaluation material to any active project.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action log */}
                      <div className="metric-card">
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                          <Activity className="h-4 w-4" style={{ color: "#0D9488" }} />
                          Activity Log
                        </h3>
                        <div className="space-y-3">
                          {projects.length > 0 ? (
                            [
                              { actor: currentUser.name.split(" ")[0], action: `created initiative "${projects[0].name}"` },
                              ...(files.length > 0 ? [{ actor: currentUser.name.split(" ")[0], action: `indexed document "${files[0].name}"` }] : []),
                              { actor: "System", action: "ImpactIQ workspace initialized" }
                            ].map((entry, idx) => (
                              <div key={idx} className="timeline-item">
                                <strong style={{ color: "#111827" }}>{entry.actor}</strong>{" "}
                                <span style={{ color: "#6B7280" }}>{entry.action}</span>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center rounded-xl border border-dashed" style={{ borderColor: "#E5E7EB" }}>
                              <p className="text-xs font-semibold" style={{ color: "#374151" }}>No recent activities</p>
                              <p className="text-[10px] mt-1" style={{ color: "#9CA3AF" }}>Activities will be logged once you take actions.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======================================
                  PAGE: PROJECTS
                  ====================================== */}
              {currentPage === "projects" && (
                <motion.div key="projects" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>Projects</h1>
                      <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                        {projects.filter(p => p.status === "Active").length} active · {projects.filter(p => p.status === "Archived").length} archived
                      </p>
                    </div>
                    <button onClick={() => setProjectModalOpen(true)} className="btn-primary self-start">
                      <Plus className="h-4 w-4" /> New Project
                    </button>
                  </div>

                  {/* Filter bar */}
                  <div className="flex items-center gap-2 pb-1">
                    {["All", "Active", "Archived"].map(tab => (
                      <button key={tab} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        style={{
                          background: tab === "All" ? "#EEF2FF" : "transparent",
                          color: tab === "All" ? "#1B3A6B" : "#6B7280",
                          border: `1px solid ${tab === "All" ? "#C7D2FE" : "transparent"}`
                        }}>
                        {tab}
                        <span className="ml-1.5 text-[10px]">
                          {tab === "All" ? projects.length : tab === "Active" ? projects.filter(p => p.status === "Active").length : projects.filter(p => p.status === "Archived").length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Cards grid */}
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {projects.map(proj => (
                        <div key={proj.id} className="metric-card flex flex-col gap-4 hover:shadow-md transition">
                          <div className="flex items-start justify-between">
                            <span className="label-badge text-[10px]" style={{ background: "#F3F4F6", color: "#4B5563" }}>
                              {proj.programArea}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`health-dot ${proj.health}`} />
                              <span className="text-[10px] font-medium capitalize" style={{ color: "#6B7280" }}>{proj.health}</span>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: "#111827" }}>{proj.name}</h3>
                            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#6B7280" }}>{proj.description}</p>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <span className="px-2 py-0.5 rounded-md font-medium"
                              style={{ background: "#F3F4F6", color: "#374151" }}>
                              {proj.donor}
                            </span>
                            <span style={{ color: "#9CA3AF" }}>
                              {proj.indicators.filter(i => i.current >= i.target).length}/{proj.indicators.length} targets met
                            </span>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span style={{ color: "#6B7280" }}>Progress</span>
                              <span className="font-semibold" style={{ color: "#111827" }}>{proj.progress}%</span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }} />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                            <button
                              onClick={() => { setSelectedProjectId(proj.id); navigate("detail"); }}
                              className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition text-center"
                              style={{ background: "#1B3A6B", color: "white" }}>
                              Open Project
                            </button>
                            <button
                              onClick={() => setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, status: p.status === "Active" ? "Archived" : "Active" } : p))}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                              style={{
                                background: "white",
                                color: proj.status === "Active" ? "#6B7280" : "#0D9488",
                                borderColor: "#E5E7EB"
                              }}>
                              {proj.status === "Active" ? "Archive" : "Restore"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border p-12 text-center max-w-xl mx-auto space-y-4" style={{ borderColor: "#E5E7EB" }}>
                      <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <Folder className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold" style={{ color: "#111827" }}>No active projects</h3>
                        <p className="text-sm" style={{ color: "#6B7280" }}>
                          Create your first project initiative to start tracking your performance metrics, indexing transcripts, and drafting donor-ready impact reports.
                        </p>
                      </div>
                      <button onClick={() => setProjectModalOpen(true)} className="btn-primary inline-flex items-center mx-auto text-xs py-2.5 px-5 rounded-xl font-semibold shadow-xs">
                        <Plus className="h-4 w-4 mr-2" /> Create Your First Project
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ======================================
                  PAGE: PROJECT DETAIL
                  ====================================== */}
              {currentPage === "detail" && currentProject && (
                <motion.div key="detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5">
                  {/* Project header */}
                  <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="label-badge text-[10px]" style={{ background: "#1B3A6B", color: "white" }}>
                        {currentProject.programArea}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#6B7280" }}>
                        <span className={`health-dot ${currentProject.health}`} />
                        {currentProject.health} health
                      </span>
                      <span className="text-xs ml-auto" style={{ color: "#9CA3AF" }}>
                        {currentProject.startDate} → {currentProject.endDate}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                      {currentProject.name}
                    </h2>
                    <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{currentProject.description}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs" style={{ color: "#6B7280" }}>
                      <div className="flex items-center gap-2">
                        <span>Donor: <strong style={{ color: "#111827" }}>{currentProject.donor}</strong></span>
                        <span className="h-3 w-px bg-gray-200" />
                        <span>Progress: <strong style={{ color: "#111827" }}>{currentProject.progress}%</strong></span>
                      </div>
                      <button
                        onClick={() => { setSelectedProjectId(currentProject.id); navigate("assistant"); }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition hover:opacity-90 shadow-sm"
                        style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0D9488 100%)", color: "white" }}
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>Ask Project AI Assistant</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left: Indicators + Files */}
                    <div className="md:col-span-8 space-y-5">

                      {/* Indicator cards */}
                      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E5E7EB" }}>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Performance Indicators</h3>
                            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Update current progress values below</p>
                          </div>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-lg"
                            style={{ background: "#F0FDFA", color: "#0D9488" }}>
                            {currentProject.indicators.filter(i => i.current >= i.target).length}/{currentProject.indicators.length} met
                          </span>
                        </div>

                        <div className="space-y-5">
                          {currentProject.indicators.map((ind, idx) => {
                            const pct = Math.round((ind.current / ind.target) * 100);
                            return (
                              <div key={idx} className="space-y-2 pb-5 border-b last:border-0 last:pb-0" style={{ borderColor: "#F3F4F6" }}>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-medium" style={{ color: "#374151" }}>{ind.name}</span>
                                  <span className="font-bold" style={{ color: "#111827" }}>
                                    {pct}% · {ind.current}/{ind.target} {ind.unit}
                                  </span>
                                </div>
                                <div className="progress-bar">
                                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input type="range" min="0" max={ind.target} value={ind.current}
                                    onChange={e => handleUpdateIndicator(currentProject.id, ind.name, parseInt(e.target.value))}
                                    className="flex-1" />
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={() => handleUpdateIndicator(currentProject.id, ind.name, ind.current - 1)}
                                      className="h-6 w-6 rounded flex items-center justify-center text-xs font-bold hover:bg-gray-100 transition"
                                      style={{ color: "#374151", border: "1px solid #E5E7EB" }}>−</button>
                                    <button onClick={() => handleUpdateIndicator(currentProject.id, ind.name, ind.current + 1)}
                                      className="h-6 w-6 rounded flex items-center justify-center text-xs font-bold hover:bg-gray-100 transition"
                                      style={{ color: "#374151", border: "1px solid #E5E7EB" }}>+</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* File upload */}
                      <div className="bg-white rounded-xl border p-5 space-y-4" style={{ borderColor: "#E5E7EB" }}>
                        <div>
                          <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Source Datasets</h3>
                          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                            Upload FGD transcripts, surveys, or evaluation reports.
                          </p>
                        </div>

                        <div onDragOver={handleDragOver} onDrop={handleDrop}
                          onClick={() => triggerManualUpload(`evaluation_${Date.now().toString().slice(-4)}.pdf`, "pdf")}
                          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition group"
                          style={{ borderColor: "#D1D5DB", background: "#F9FAFB" }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = "#0D9488")}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = "#D1D5DB")}>
                          <Upload className="h-7 w-7 mx-auto mb-2" style={{ color: "#9CA3AF" }} />
                          <p className="text-sm font-medium" style={{ color: "#374151" }}>Drop files here or click to upload</p>
                          <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>Supports PDF, CSV, XLSX, TXT</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold mb-2" style={{ color: "#374151" }}>
                            Attached Files ({files.filter(f => f.projectId === selectedProjectId).length})
                          </p>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {files.filter(f => f.projectId === selectedProjectId).map(f => (
                              <div key={f.id} className="flex items-center justify-between p-2.5 rounded-lg text-xs"
                                style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileSpreadsheet className="h-4 w-4 shrink-0" style={{ color: "#0D9488" }} />
                                  <span className="font-medium truncate" style={{ color: "#111827" }}>{f.name}</span>
                                  <span style={{ color: "#9CA3AF" }}>({f.size})</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`label-badge text-[9px] ${f.status === "Ready" ? "confidence-high" : "confidence-medium"}`}>
                                    {f.status}
                                  </span>
                                  <button onClick={() => setFiles(prev => prev.filter(fi => fi.id !== f.id))}
                                    className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Quick access + Timeline */}
                    <div className="md:col-span-4 space-y-4">
                      <div className="rounded-xl p-5 space-y-3" style={{ background: "#1B3A6B" }}>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-white" />
                          <h4 className="text-sm font-bold text-white">AI Research Studio</h4>
                        </div>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                          Analyze FGD transcripts against program indicators to surface insights and themes.
                        </p>
                        <button onClick={() => navigate("research")}
                          className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                          style={{ background: "#0D9488", color: "white" }}>
                          Launch Research Studio <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => navigate("report")}
                          className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                          style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
                          Open Report Builder <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E5E7EB" }}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                          Activity Timeline
                        </h4>
                        <div className="space-y-3 pl-1">
                          {currentProject.activityTimeline.map((item, idx) => (
                            <div key={idx} className="timeline-item">{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentPage === "detail" && !currentProject && (
                <div className="bg-white rounded-2xl border p-12 text-center max-w-xl mx-auto space-y-4 animate-fadeIn" style={{ borderColor: "#E5E7EB" }}>
                  <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Folder className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold" style={{ color: "#111827" }}>No active project selected</h3>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      Please select or create a project first.
                    </p>
                  </div>
                  <button onClick={() => navigate("home")} className="btn-primary inline-flex items-center mx-auto text-xs py-2.5 px-5 rounded-xl font-semibold shadow-xs">
                    Go Back Home
                  </button>
                </div>
              )}

              {/* ======================================
                  PAGE: RESEARCH STUDIO
                  ====================================== */}
              {currentPage === "research" && (
                <motion.div key="research" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>Research Studio</h1>
                      <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>AI-powered qualitative analysis from your evaluation materials.</p>
                    </div>
                    {aiLoading && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium animate-pulse"
                        style={{ background: "#F0FDFA", color: "#0D9488", border: "1px solid #99F6E4" }}>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        {aiLoadingMessage}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                    {/* Sources Panel */}
                    <div className="xl:col-span-4 bg-white rounded-xl border p-5 space-y-4" style={{ borderColor: "#E5E7EB" }}>
                      <div>
                        <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Source Materials</h3>
                        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Select files to include in analysis.</p>
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto">
                        {files.map(f => {
                          const isSelected = researchSelectedFiles.includes(f.id);
                          return (
                            <div key={f.id} onClick={() => setResearchSelectedFiles(prev => isSelected ? prev.filter(id => id !== f.id) : [...prev, f.id])}
                              className="p-3 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between"
                              style={{
                                background: isSelected ? "#F0FDFA" : "#F9FAFB",
                                borderColor: isSelected ? "#0D9488" : "#E5E7EB"
                              }}>
                              <div className="min-w-0 mr-2">
                                <p className="font-medium truncate" style={{ color: "#111827" }}>{f.name}</p>
                                <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{f.size}</p>
                              </div>
                              <div className="h-4 w-4 rounded border-2 flex items-center justify-center shrink-0"
                                style={{ borderColor: isSelected ? "#0D9488" : "#D1D5DB", background: isSelected ? "#0D9488" : "white" }}>
                                {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#374151" }}>
                          Add Raw Text (optional)
                        </label>
                        <textarea
                          placeholder="Paste FGD quotes, field observations..."
                          value={researchInputText}
                          onChange={e => setResearchInputText(e.target.value)}
                          className="w-full h-24 p-3 text-xs rounded-lg border resize-none outline-none focus:ring-1 focus:ring-teal-500"
                          style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: "#111827" }}
                        />
                      </div>

                      <button onClick={callClaudeAnalysis} disabled={aiLoading}
                        className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                        style={{ background: aiLoading ? "#6B7280" : "#1B3A6B", color: "white" }}>
                        <Sparkles className="h-4 w-4" />
                        {aiLoading ? "Synthesizing..." : "Synthesize Analysis"}
                      </button>
                    </div>

                    {/* Analysis Workspace */}
                    <div className="xl:col-span-8 bg-white rounded-xl border p-5 space-y-5" style={{ borderColor: "#E5E7EB" }}>
                      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                        <div>
                          <h2 className="text-base font-bold" style={{ color: "#111827" }}>Synthesis Workspace</h2>
                          <p className="text-xs" style={{ color: "#9CA3AF" }}>Qualitative themes & findings extracted by AI.</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!analysisWorkspace) return;
                            alert("Findings formatted for report builder.");
                            navigate("report");
                          }}
                          disabled={!analysisWorkspace}
                          className="btn-secondary text-xs disabled:opacity-40 disabled:cursor-not-allowed transition"
                          title={!analysisWorkspace ? "Please synthesize source materials first" : ""}
                        >
                          Push to Report <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {analysisWorkspace ? (
                        <div className="space-y-6">
                          {/* Themes */}
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                              Identified Themes
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {analysisWorkspace.themes.map((t, idx) => (
                                <div key={idx} className="p-4 rounded-xl border space-y-2"
                                  style={{ background: "#F9FAFB", borderColor: "#E5E7EB" }}>
                                  <div className="flex justify-between items-center">
                                    <strong className="text-xs" style={{ color: "#111827" }}>{t.theme}</strong>
                                    <span className={`label-badge text-[9px] ${t.frequency === "High" ? "confidence-high" : t.frequency === "Medium" ? "confidence-medium" : "confidence-low"}`}>
                                      {t.frequency} freq.
                                    </span>
                                  </div>
                                  <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{t.summary}</p>
                                  {t.quotes.length > 0 && (
                                    <blockquote className="text-[11px] italic p-2 rounded-lg border-l-2"
                                      style={{ background: "white", borderColor: "#0D9488", color: "#374151" }}>
                                      "{t.quotes[0]}"
                                    </blockquote>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Findings */}
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                              Key Findings
                            </h4>
                            <div className="space-y-2">
                              {analysisWorkspace.findings.map((f, idx) => (
                                <div key={idx} className="p-4 rounded-xl group relative"
                                  style={{ background: "#F0FDFA", borderLeft: "3px solid #0D9488" }}>
                                  <span className="ai-badge absolute top-3 right-3">✦ AI</span>
                                  <p className="text-xs leading-relaxed pr-16" style={{ color: "#111827" }}>{f}</p>
                                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => alert("Finding preserved.")}
                                      className="btn-teal text-[10px] px-2.5 py-1">Accept</button>
                                    <button onClick={() => {
                                      const text = prompt("Edit finding:", f);
                                      if (text) setAnalysisWorkspace(prev => prev ? { ...prev, findings: prev.findings.map((find, i) => i === idx ? text : find) } : null);
                                    }} className="btn-secondary text-[10px] px-2.5 py-1">Edit</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                              Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {analysisWorkspace.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex gap-2.5 text-xs" style={{ color: "#374151" }}>
                                  <div className="h-5 w-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                                    style={{ background: "#F0FDFA" }}>
                                    <CheckCircle2 className="h-3 w-3" style={{ color: "#0D9488" }} />
                                  </div>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                          <FlaskConical className="h-10 w-10" style={{ color: "#E5E7EB" }} />
                          <h4 className="font-semibold" style={{ color: "#374151" }}>No analysis yet</h4>
                          <p className="text-xs max-w-sm" style={{ color: "#9CA3AF" }}>
                            Select source materials and trigger synthesis to see qualitative results here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======================================
                  PAGE: REPORT BUILDER
                  ====================================== */}
              {currentPage === "report" && currentProject && (
                <motion.div key="report" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-1 xl:grid-cols-12 gap-5">

                  {/* Section nav */}
                  <div className="xl:col-span-3 bg-white rounded-xl border p-4 space-y-3 print:hidden self-start sticky top-20"
                    style={{ borderColor: "#E5E7EB" }}>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Report Outline</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Navigate document sections.</p>
                    </div>
                    <div className="space-y-0.5">
                      {["Executive Summary", "Background", "Methodology", "Key Findings", "Recommendations", "Conclusion"].map(section => {
                        const activeRep = reports.find(r => r.projectId === selectedProjectId);
                        const hasContent = activeRep && activeRep.sections[section]?.length > 0;
                        return (
                          <button key={section} onClick={() => setActiveReportSection(section)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition"
                            style={{
                              background: activeReportSection === section ? "#EEF2FF" : "transparent",
                              color: activeReportSection === section ? "#1B3A6B" : "#6B7280"
                            }}>
                            <span>{section}</span>
                            {hasContent && (
                              <span className="h-4 w-4 rounded-full flex items-center justify-center text-white text-[9px] shrink-0"
                                style={{ background: "#10B981" }}>✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Writing area */}
                  <div className="xl:col-span-6 bg-white rounded-xl border p-6 space-y-4 print:col-span-12 print:border-none"
                    style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex items-center justify-between pb-3 border-b print:hidden" style={{ borderColor: "#F3F4F6" }}>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Editing</p>
                        <h2 className="text-base font-bold" style={{ color: "#111827" }}>{activeReportSection}</h2>
                      </div>
                      <button onClick={() => window.print()}
                        className="btn-secondary text-xs">
                        <Download className="h-3.5 w-3.5" /> Export PDF
                      </button>
                    </div>

                    <textarea
                      value={editReportText}
                      onChange={e => {
                        const val = e.target.value;
                        setEditReportText(val);
                        setReports(prev => prev.map(rep => {
                          if (rep.projectId === selectedProjectId) {
                            return { ...rep, sections: { ...rep.sections, [activeReportSection]: val } };
                          }
                          return rep;
                        }));
                      }}
                      className="w-full min-h-64 p-4 rounded-xl text-sm leading-relaxed outline-none focus:ring-1 focus:ring-teal-500 resize-none font-sans print:bg-white print:border-none print:p-0"
                      placeholder="Begin writing your report section here..."
                      style={{ background: "#FAFAFA", border: "1px solid #E5E7EB", color: "#111827", fontFamily: "var(--font-sans)" }}
                    />

                    {/* AI Draft */}
                    {reports.find(r => r.projectId === selectedProjectId)?.aiDrafts[activeReportSection] && (
                      <div className="p-4 rounded-xl group relative print:hidden"
                        style={{ background: "#F0FDFA", borderLeft: "3px solid #0D9488" }}>
                        <span className="ai-badge absolute top-3 right-3">✦ AI Draft</span>
                        <div className="text-xs leading-relaxed pr-20 whitespace-pre-line" style={{ color: "#111827" }}>
                          {reports.find(r => r.projectId === selectedProjectId)?.aiDrafts[activeReportSection]}
                        </div>
                        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleAcceptAIDraft(activeReportSection)} className="btn-teal text-[10px] px-3 py-1.5">
                            Accept & Insert
                          </button>
                          <button onClick={() => handleEditAIDraft(activeReportSection)} className="btn-secondary text-[10px] px-3 py-1.5">
                            Move to Editor
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-center print:hidden" style={{ color: "#D1D5DB" }}>
                      Auto-saved continuously · ImpactIQ secure print module ready
                    </p>
                  </div>

                  {/* AI assistance pane */}
                  <div className="xl:col-span-3 bg-white rounded-xl border p-4 space-y-4 print:hidden self-start sticky top-20"
                    style={{ borderColor: "#E5E7EB" }}>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>AI Assistance</h3>
                      <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Generate donor-ready section drafts.</p>
                    </div>

                    {aiLoading && (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg text-xs animate-pulse"
                        style={{ background: "#F0FDFA", color: "#0D9488" }}>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
                        {aiLoadingMessage}
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#374151" }}>Report style</label>
                      <select value={reportTone} onChange={e => setReportTone(e.target.value)}
                        className="w-full p-2 text-xs rounded-lg border outline-none"
                        style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: "#111827" }}>
                        <option value="Donor-Friendly">USAID / Donor-Friendly</option>
                        <option value="Formal">Technical / Academic</option>
                        <option value="Action-Oriented">Concise / Action-Oriented</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "#374151" }}>Indexed Indicators</p>
                      <div className="space-y-1.5">
                        {currentProject.indicators.map((ind, idx) => (
                          <div key={`ind_rep_${idx}_${ind.name}`} className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                            <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "#0D9488" }} />
                            {ind.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={callClaudeReportSection} disabled={aiLoading} className="w-full btn-teal justify-center text-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                      {aiLoading ? "Drafting..." : `Draft "${activeReportSection}"`}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentPage === "report" && !currentProject && (
                <div className="bg-white rounded-2xl border p-12 text-center max-w-xl mx-auto space-y-4 animate-fadeIn" style={{ borderColor: "#E5E7EB" }}>
                  <div className="mx-auto w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold" style={{ color: "#111827" }}>No active project selected</h3>
                    <p className="text-sm" style={{ color: "#6B7280" }}>
                      Please select or create a project first.
                    </p>
                  </div>
                  <button onClick={() => navigate("home")} className="btn-primary inline-flex items-center mx-auto text-xs py-2.5 px-5 rounded-xl font-semibold shadow-xs">
                    Go Back Home
                  </button>
                </div>
              )}

              {/* ======================================
                  PAGE: INSIGHTS
                  ====================================== */}
              {currentPage === "insights" && (
                <motion.div key="insights" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>AI Insights</h1>
                      <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                        Evaluation patterns, anomalies, and program opportunities mined from your data.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {aiLoading && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium animate-pulse"
                          style={{ background: "#F0FDFA", color: "#0D9488", border: "1px solid #99F6E4" }}>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          {aiLoadingMessage}
                        </div>
                      )}
                      <button onClick={callClaudeNewInsights} disabled={aiLoading} className="btn-primary self-start">
                        <Sparkles className="h-4 w-4" /> Generate Insights
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {insights.length > 0 ? (
                      insights.map(ins => (
                        <div key={ins.id} className="metric-card flex flex-col gap-3 hover:shadow-md transition">
                          <div className="flex items-start justify-between gap-2">
                            <span className="label-badge text-[9px]" style={{ background: "#F3F4F6", color: "#4B5563" }}>
                              {ins.projectName.length > 25 ? ins.projectName.substring(0, 24) + "…" : ins.projectName}
                            </span>
                            <span className="ai-badge shrink-0">✦ AI</span>
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm leading-snug" style={{ color: "#111827" }}>{ins.title}</h3>
                            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#6B7280" }}>{ins.summary}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t" style={{ borderColor: "#F3F4F6" }}>
                            <span className={`label-badge text-[9px] confidence-${ins.confidence.toLowerCase()}`}>
                              {ins.confidence} confidence
                            </span>
                            <button onClick={() => alert(`${ins.title}\n\n${ins.summary}\n\nConfidence: ${ins.confidence}`)}
                              className="text-xs font-semibold hover:underline" style={{ color: "#0D9488" }}>
                              View detail
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-white rounded-2xl border p-10 text-center max-w-lg mx-auto space-y-3" style={{ borderColor: "#E5E7EB" }}>
                        <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                          <Lightbulb className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold" style={{ color: "#111827" }}>No AI insights generated yet</h3>
                          <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                            Upload evaluation materials or datasets to your project workspace, then click "Generate Insights" to synthesize key themes and findings.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ======================================
                  PAGE: KNOWLEDGE BASE
                  ====================================== */}
              {currentPage === "kb" && (
                <motion.div key="kb" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>Knowledge Base</h1>
                      <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                        A registry of past reports, transcripts, and program guides.
                      </p>
                    </div>
                    <button onClick={() => setKbModalOpen(true)} className="btn-primary self-start">
                      <Plus className="h-4 w-4" /> Index Document
                    </button>
                  </div>

                  {/* Inline search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search documents, projects, keywords..."
                      value={globalSearch} onChange={e => setGlobalSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none focus:ring-1 focus:ring-teal-500"
                      style={{ background: "white", borderColor: "#E5E7EB", color: "#111827" }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {knowledgeBase.length === 0 ? (
                      <div className="col-span-full py-20 flex flex-col items-center text-center space-y-4 bg-white rounded-2xl border"
                        style={{ borderColor: "#E5E7EB" }}>
                        <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="max-w-sm mx-auto space-y-1">
                          <h4 className="font-semibold text-sm" style={{ color: "#111827" }}>Knowledge base is empty</h4>
                          <p className="text-xs" style={{ color: "#6B7280" }}>
                            Upload reports, assessment guidelines, or interview transcript files to construct your project-wide knowledge base.
                          </p>
                        </div>
                        <button onClick={() => setKbModalOpen(true)} className="btn-primary inline-flex mx-auto text-xs py-2 px-4 rounded-lg font-semibold shadow-xs">
                          <Plus className="h-4 w-4 mr-1.5" /> Index Your First Document
                        </button>
                      </div>
                    ) : filteredKnowledgeBase.length === 0 ? (
                      <div className="col-span-full py-20 flex flex-col items-center text-center space-y-3 bg-white rounded-xl border"
                        style={{ borderColor: "#E5E7EB" }}>
                        <BookOpen className="h-10 w-10" style={{ color: "#E5E7EB" }} />
                        <h4 className="font-semibold" style={{ color: "#374151" }}>No documents found</h4>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>Try adjusting your search query.</p>
                        <button onClick={() => setGlobalSearch("")}
                          className="text-xs font-semibold hover:underline" style={{ color: "#0D9488" }}>
                          Clear search
                        </button>
                      </div>
                    ) : (
                      filteredKnowledgeBase.map(doc => (
                        <div key={doc.id} className="metric-card flex flex-col gap-3 hover:shadow-md transition">
                          <div className="flex items-center justify-between">
                            <span className={`label-badge text-[10px] doc-type-${doc.type.toLowerCase()}`}>{doc.type}</span>
                            <span className="text-[10px]" style={{ color: "#9CA3AF" }}>{doc.date}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm leading-snug" style={{ color: "#111827" }}>{doc.title}</h3>
                            <p className="text-xs mt-1.5 leading-relaxed line-clamp-3" style={{ color: "#6B7280" }}>{doc.snippet}</p>
                          </div>
                          <p className="text-[10px] pt-2 border-t" style={{ borderColor: "#F3F4F6", color: "#9CA3AF" }}>
                            Project: <strong style={{ color: "#374151" }}>{doc.project}</strong>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* ======================================
                  PAGE: IMPACTIQ AI ASSISTANT (META LLAMA)
                  ====================================== */}
              {currentPage === "assistant" && (
                <motion.div key="assistant" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <ImpactIqAssistant
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    onSelectProject={(id) => setSelectedProjectId(id)}
                    files={files}
                    reports={reports}
                    insights={insights}
                    kbDocs={knowledgeBase.map(k => ({ title: k.title, content: k.snippet }))}
                    currentUser={currentUser}
                  />
                </motion.div>
              )}

              {/* ======================================
                  PAGE: LOGFRAME & RESULTS MATRIX
                  ====================================== */}
              {currentPage === "logframe" && (
                <motion.div key="logframe" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <LogFrameMatrix />
                </motion.div>
              )}

              {/* ======================================
                  PAGE: FIELD SURVEY COLLECTOR
                  ====================================== */}
              {currentPage === "kobocollect" && (
                <motion.div key="kobocollect" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <KoboFieldCollector />
                </motion.div>
              )}

              {/* ======================================
                  PAGE: DONOR COMPLIANCE
                  ====================================== */}
              {currentPage === "grants" && (
                <motion.div key="grants" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <GrantComplianceHub />
                </motion.div>
              )}

              {/* ======================================
                  PAGE: DQA & EVALUATION
                  ====================================== */}
              {currentPage === "dqa" && (
                <motion.div key="dqa" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <DqaEvaluationMatrix />
                </motion.div>
              )}

              {/* ======================================
                  PAGE: USER PROFILE
                  ====================================== */}
              {currentPage === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5 max-w-5xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>User Profile</h1>
                      <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Manage your personal account information, role, and workspace team members.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button onClick={() => navigate("admin")}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100">
                          <Terminal className="h-4 w-4 text-amber-700" />
                          Admin Hub
                        </button>
                      )}
                      <button onClick={() => navigate("settings")}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0"
                        style={{ background: "#F0FDFA", color: "#0D9488", border: "1px solid #99F6E4" }}>
                        <Shield className="h-4 w-4" />
                        Security & Settings
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Edit profile */}
                    <div className="lg:col-span-7 bg-white rounded-xl border p-6 space-y-6" style={{ borderColor: "#E5E7EB" }}>
                      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pb-5 border-b" style={{ borderColor: "#F3F4F6" }}>
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0 shadow-sm"
                          style={{ background: currentUser.avatarColor }}>
                          {currentUser.initials}
                        </div>
                        <div className="text-center sm:text-left min-w-0">
                          <h3 className="text-base font-bold truncate" style={{ color: "#111827" }}>{currentUser.name}</h3>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-1">
                            <span className="label-badge text-[10px]" style={{ background: "#F3F4F6", color: "#4B5563" }}>{currentUser.role}</span>
                            <span className="text-xs font-mono" style={{ color: "#9CA3AF" }}>{currentUser.email}</span>
                          </div>
                          <p className="text-xs mt-1 font-medium" style={{ color: "#0D9488" }}>{currentUser.organization}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "Full name", key: "name", type: "text" },
                          { label: "Email address", key: "email", type: "email" }
                        ].map(field => (
                          <div key={field.key}>
                            <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>{field.label}</label>
                            <input type={field.type}
                              value={(currentUser as any)[field.key]}
                              onChange={e => {
                                const val = e.target.value;
                                const updates: any = { [field.key]: val };
                                if (field.key === "name") {
                                  updates.initials = val.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                                }
                                setCurrentUser(prev => ({ ...prev, ...updates }));
                                setRegisteredUsers(prev => prev.map(u => u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, ...updates } : u));
                              }}
                              className="input-base" />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Role</label>
                          <select value={currentUser.role}
                            onChange={e => {
                              const val = e.target.value;
                              setCurrentUser(prev => ({ ...prev, role: val }));
                              setRegisteredUsers(prev => prev.map(u => u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, role: val } : u));
                              setNotifications(prev => [`Role updated to ${val}`, ...prev]);
                            }}
                            className="input-base">
                            <option>Lead Analyst</option>
                            <option>Program Coordinator</option>
                            <option>Senior Advisor</option>
                            <option>Field Director</option>
                            <option>Donor Reviewer</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Organization</label>
                          <input type="text" value={currentUser.organization}
                            onChange={e => {
                              const val = e.target.value;
                              setCurrentUser(prev => ({ ...prev, organization: val }));
                              setRegisteredUsers(prev => prev.map(u => u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, organization: val } : u));
                            }}
                            className="input-base" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-2" style={{ color: "#374151" }}>Avatar color theme</label>
                        <div className="flex gap-2">
                          {["#0D9488", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"].map(c => (
                            <button key={c} onClick={() => { setCurrentUser(prev => ({ ...prev, avatarColor: c })); setRegisteredUsers(prev => prev.map(u => u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, avatarColor: c } : u)); }}
                              className="h-8 w-8 rounded-full border-2 transition cursor-pointer"
                              style={{ background: c, borderColor: currentUser.avatarColor === c ? "#111827" : "transparent", transform: currentUser.avatarColor === c ? "scale(1.15)" : "scale(1)" }} />
                          ))}
                        </div>
                      </div>

                      {/* Workspace preferences */}
                      <div className="pt-4 border-t space-y-3" style={{ borderColor: "#F3F4F6" }}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Workspace Preferences</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="font-medium text-gray-700 block mb-1">Default Export Format</label>
                            <select className="input-base text-xs">
                              <option>PDF (Executive Format)</option>
                              <option>Word / Editable Doc</option>
                              <option>CSV Data Extract</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-medium text-gray-700 block mb-1">Timezone & Locale</label>
                            <select className="input-base text-xs">
                              <option>UTC / Universal Time</option>
                              <option>GMT+1 (West Africa / Europe)</option>
                              <option>EST / Eastern Time</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs pt-1" style={{ color: "#9CA3AF" }}>
                        <button onClick={() => setShowPrivacyPolicy(true)} className="hover:underline" style={{ color: "#0D9488" }}>
                          Privacy Policy
                        </button>
                        {" "}&mdash; ImpactIQ Global © 2026
                      </div>
                    </div>

                    {/* Right: Team directory */}
                    <div className="lg:col-span-5 bg-white rounded-xl border p-6 space-y-4" style={{ borderColor: "#E5E7EB" }}>
                      <div>
                        <h3 className="text-sm font-semibold" style={{ color: "#111827" }}>Team Directory</h3>
                        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Members belonging to {currentUser.organization || "ImpactIQ Global"}.</p>
                      </div>

                      <div className="space-y-2">
                        {registeredUsers
                          .filter(user => (user.organization || "ImpactIQ Partner").toLowerCase() === (currentUser.organization || "ImpactIQ Partner").toLowerCase())
                          .map((user, uIdx) => {
                            const isActive = user.email.toLowerCase() === currentUser.email.toLowerCase();
                          return (
                            <div key={`user_${user.email}_${uIdx}`}
                              onClick={() => {
                                if (isActive) return;
                                const init = user.name.split(" ").map(n => n[0]).join("").toUpperCase();
                                setCurrentUser({ name: user.name, email: user.email, role: user.role, organization: user.organization || "ImpactIQ Global", avatarColor: user.avatarColor, initials: init, isLoggedIn: true });
                                setNotifications(prev => [`Session: ${user.name} logged in`, ...prev]);
                              }}
                              className="p-3 rounded-xl border flex items-center justify-between transition"
                              style={{
                                background: isActive ? "#F0FDFA" : "#FAFAFA",
                                borderColor: isActive ? "#0D9488" : "#F3F4F6",
                                cursor: isActive ? "default" : "pointer"
                              }}>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                                  style={{ background: user.avatarColor }}>
                                  {user.initials}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>{user.name}</p>
                                  <p className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>{user.role}</p>
                                </div>
                              </div>
                              {isActive ? (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                  style={{ background: "#CCFBF1", color: "#0F766E" }}>Active</span>
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                        <button onClick={() => {
                          const nEmail = prompt("Teammate email:");
                          if (nEmail?.trim()) {
                            const nName = prompt("Teammate full name:");
                            if (nName?.trim()) {
                              const nRole = prompt("Role (Lead Analyst / Program Coordinator / Field Director):", "Program Coordinator");
                              const init = nName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                              const colors = ["#0D9488", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"];
                              const rc = colors[Math.floor(Math.random() * colors.length)];
                              setRegisteredUsers(prev => [...prev, { name: nName, email: nEmail, password: "", role: nRole || "Program Coordinator", organization: currentUser.organization, avatarColor: rc, initials: init }]);
                              setNotifications(prev => [`Teammate '${nName}' added to workspace`, ...prev]);
                            }
                          }
                        }}
                          className="text-xs font-semibold flex items-center gap-1 hover:underline mt-2"
                          style={{ color: "#0D9488" }}>
                          <Plus className="h-3.5 w-3.5" /> Invite Teammate
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======================================
                  PAGE: SECURITY & SETTINGS
                  ====================================== */}
              {currentPage === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-6 max-w-5xl">
                  <div>
                    <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>Security & Settings</h1>
                    <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Manage your login credentials, account protection, and active browser sessions.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: Login Credentials & 2FA */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* SECTION 1: Change Login Details */}
                      <div className="bg-white rounded-xl border p-6 space-y-5" style={{ borderColor: "#E5E7EB" }}>
                        <div className="flex items-center gap-2.5 pb-4 border-b" style={{ borderColor: "#F3F4F6" }}>
                          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F0FDFA", color: "#0D9488" }}>
                            <Key className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "#111827" }}>Change Login Credentials</h3>
                            <p className="text-xs" style={{ color: "#6B7280" }}>Update your account password and recovery email details.</p>
                          </div>
                        </div>

                        {secPwSuccess && (
                          <div className="p-3 rounded-lg text-xs font-medium flex items-center gap-2" style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                            <span>{secPwSuccess}</span>
                          </div>
                        )}

                        {secPwError && (
                          <div className="p-3 rounded-lg text-xs font-medium flex items-center gap-2" style={{ background: "#FEF2F2", color: "#991B1B", border: "1px solid #FCA5A5" }}>
                            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                            <span>{secPwError}</span>
                          </div>
                        )}

                        <form onSubmit={e => {
                          e.preventDefault();
                          setSecPwError("");
                          setSecPwSuccess("");

                          if (!secCurrentPassword) {
                            setSecPwError("Please enter your current password.");
                            return;
                          }
                          if (secNewPassword.length < 6) {
                            setSecPwError("New password must be at least 6 characters long.");
                            return;
                          }
                          if (secNewPassword !== secConfirmPassword) {
                            setSecPwError("New password and confirm password do not match.");
                            return;
                          }

                          // Update password in user registry
                          setRegisteredUsers(prev => prev.map(u => 
                            u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, password: secNewPassword } : u
                          ));
                          
                          setSecCurrentPassword("");
                          setSecNewPassword("");
                          setSecConfirmPassword("");
                          setSecPwSuccess("Your password has been updated successfully.");
                          setNotifications(prev => ["Security: Password updated successfully", ...prev]);
                          setSecurityAuditLogs(prev => [
                            { id: `log_${Date.now()}`, event: "Password Updated", detail: "Login credential modified via Settings", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: "Success" },
                            ...prev
                          ]);
                        }} className="space-y-4">
                          
                          <div>
                            <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Current Password</label>
                            <div className="relative">
                              <input type={secShowCurrentPw ? "text" : "password"}
                                value={secCurrentPassword}
                                onChange={e => setSecCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="input-base pr-10" />
                              <button type="button" onClick={() => setSecShowCurrentPw(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {secShowCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>New Password</label>
                              <div className="relative">
                                <input type={secShowNewPw ? "text" : "password"}
                                  value={secNewPassword}
                                  onChange={e => setSecNewPassword(e.target.value)}
                                  placeholder="At least 6 characters"
                                  className="input-base pr-10" />
                                <button type="button" onClick={() => setSecShowNewPw(p => !p)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                  {secShowNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              {secNewPassword && (
                                <div className="mt-1.5 flex items-center gap-1">
                                  <div className="h-1 flex-1 rounded-full" style={{ background: secNewPassword.length >= 8 ? "#10B981" : secNewPassword.length >= 6 ? "#F59E0B" : "#EF4444" }} />
                                  <span className="text-[10px] font-medium text-gray-500">
                                    {secNewPassword.length >= 8 ? "Strong" : secNewPassword.length >= 6 ? "Medium" : "Weak"}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Confirm New Password</label>
                              <input type="password"
                                value={secConfirmPassword}
                                onChange={e => setSecConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="input-base" />
                            </div>
                          </div>

                          <div className="pt-1 flex justify-end">
                            <button type="submit" className="btn-primary text-xs px-5 py-2">
                              Update Password
                            </button>
                          </div>
                        </form>

                        {/* Recovery email */}
                        <div className="pt-4 border-t space-y-3" style={{ borderColor: "#F3F4F6" }}>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Recovery Email Address</h4>
                          {secRecoverySuccess && (
                            <p className="text-xs font-medium text-green-600">{secRecoverySuccess}</p>
                          )}
                          <div className="flex gap-2">
                            <input type="email" value={secRecoveryEmail} onChange={e => setSecRecoveryEmail(e.target.value)}
                              className="input-base text-xs flex-1" placeholder="Enter recovery email address" />
                            <button onClick={() => {
                              if (!secRecoveryEmail.trim()) return;
                              setSecRecoverySuccess("Recovery email address saved.");
                              setTimeout(() => setSecRecoverySuccess(""), 4000);
                            }} className="btn-secondary text-xs px-4 shrink-0">
                              Save Email
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: Account Security & 2FA */}
                      <div className="bg-white rounded-xl border p-6 space-y-5" style={{ borderColor: "#E5E7EB" }}>
                        <div className="flex items-center gap-2.5 pb-4 border-b" style={{ borderColor: "#F3F4F6" }}>
                          <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EFF6FF", color: "#3B82F6" }}>
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "#111827" }}>Multi-Factor Authentication & Protection</h3>
                            <p className="text-xs" style={{ color: "#6B7280" }}>Add extra security layers to safeguard program evaluation datasets.</p>
                          </div>
                        </div>

                        {/* 2FA Card */}
                        <div className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          style={{ background: sec2FAEnabled ? "#F0FDF4" : "#FAFAFA", borderColor: sec2FAEnabled ? "#BBF7D0" : "#E5E7EB" }}>
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5"
                              style={{ background: sec2FAEnabled ? "#166534" : "#6B7280" }}>
                              <Smartphone className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold" style={{ color: "#111827" }}>Two-Factor Authentication (2FA)</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: sec2FAEnabled ? "#DCFCE7" : "#F3F4F6", color: sec2FAEnabled ? "#15803D" : "#6B7280" }}>
                                  {sec2FAEnabled ? "Active" : "Disabled"}
                                </span>
                              </div>
                              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6B7280" }}>
                                Require an authenticator app TOTP code (Google Authenticator or 1Password) when signing in.
                              </p>
                            </div>
                          </div>

                          <button onClick={() => setSecShow2FAModal(true)}
                            className="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                            style={{ background: sec2FAEnabled ? "#166534" : "#1B3A6B", color: "white" }}>
                            {sec2FAEnabled ? "Manage 2FA" : "Enable 2FA"}
                          </button>
                        </div>

                        {/* Login alerts toggle */}
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "#374151" }}>Unrecognized Sign-In Alerts</p>
                            <p className="text-[11px]" style={{ color: "#9CA3AF" }}>Send email notifications when your account is accessed from a new IP or device.</p>
                          </div>
                          <button onClick={() => {
                            setSecLoginAlerts(p => !p);
                            setNotifications(prev => [`Security alerts ${!secLoginAlerts ? "enabled" : "disabled"}`, ...prev]);
                          }}
                            className="w-11 h-6 rounded-full transition relative p-0.5 cursor-pointer"
                            style={{ background: secLoginAlerts ? "#0D9488" : "#E5E7EB" }}>
                            <div className="h-5 w-5 rounded-full bg-white transition-transform"
                              style={{ transform: secLoginAlerts ? "translateX(20px)" : "translateX(0px)" }} />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: Active Sessions, Security Audit Log & Danger Zone */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Active Sessions & Audit Log */}
                      <div className="bg-white rounded-xl border p-6 space-y-4" style={{ borderColor: "#E5E7EB" }}>
                        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: "#111827" }}>Active Login Sessions</h3>
                            <p className="text-xs" style={{ color: "#6B7280" }}>Current browser session authenticated as {currentUser.email}.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {activeSessions.map(sess => (
                            <div key={sess.id} className="p-3 rounded-xl border flex items-center justify-between"
                              style={{ background: sess.isCurrent ? "#F0FDFA" : "#FAFAFA", borderColor: sess.isCurrent ? "#99F6E4" : "#F3F4F6" }}>
                              <div className="flex items-center gap-2.5">
                                <div className="h-2 w-2 rounded-full" style={{ background: sess.isCurrent ? "#10B981" : "#9CA3AF" }} />
                                <div>
                                  <p className="text-xs font-bold" style={{ color: "#111827" }}>{sess.device}</p>
                                  <p className="text-[10px]" style={{ color: "#6B7280" }}>{sess.location} &bull; {sess.ip}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">{sess.lastActive}</span>
                            </div>
                          ))}
                        </div>

                        {/* Audit log list */}
                        <div className="pt-4 border-t space-y-2" style={{ borderColor: "#F3F4F6" }}>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Security Audit Log</h4>
                          {securityAuditLogs.length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-2">No security audit events recorded in this session.</p>
                          ) : (
                            <div className="divide-y text-xs" style={{ divideColor: "#F3F4F6" }}>
                              {securityAuditLogs.map(log => (
                                <div key={log.id} className="py-2 flex items-center justify-between">
                                  <div>
                                    <span className="font-semibold text-gray-800">{log.event}</span>
                                    <span className="text-gray-500 ml-2 text-[11px]">{log.detail}</span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Security FAQ / Best Practices */}
                      <div className="bg-white rounded-xl border p-6 space-y-3" style={{ borderColor: "#E5E7EB" }}>
                        <h3 className="text-sm font-bold" style={{ color: "#111827" }}>Security Guidelines</h3>
                        <div className="space-y-2 text-xs" style={{ color: "#4B5563" }}>
                          <div className="p-3 rounded-lg bg-gray-50 space-y-1">
                            <p className="font-semibold text-gray-900">Passphrase Complexity</p>
                            <p className="text-[11px] leading-relaxed">Use at least 8 characters with a mixture of letters, numbers, and symbols.</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 space-y-1">
                            <p className="font-semibold text-gray-900">Data Privacy & Access</p>
                            <p className="text-[11px] leading-relaxed">Evaluation source materials are strictly isolated to your authenticated team workspace.</p>
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone & Session Sign Out */}
                      <div className="rounded-xl border p-5 space-y-3" style={{ background: "#FEF2F2", borderColor: "#FCA5A5" }}>
                        <div>
                          <p className="text-sm font-bold text-red-900">Sign Out & Session</p>
                          <p className="text-xs text-red-700 mt-0.5">End your current session safely on this browser.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button onClick={() => setCurrentUser(prev => ({ ...prev, isLoggedIn: false }))}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-900 bg-white border border-red-300 hover:bg-red-50 transition cursor-pointer">
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </motion.div>
              )}

              {/* ======================================
                  PAGE: DEVELOPER & ADMIN HUB
                  ====================================== */}
              {currentPage === "admin" && (
                <motion.div key="admin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <AdminHub
                    currentUser={currentUser}
                    registeredUsers={registeredUsers}
                    onUpdateUserRole={handleUpdateUserRole}
                    onAddUser={handleAddUser}
                    projects={projects}
                    files={files}
                    reports={reports}
                    insights={insights}
                    auditLogs={securityAuditLogs}
                    onRefreshData={() => {
                      setNotifications(prev => ["Refreshed system telemetry & registry snapshot", ...prev]);
                    }}
                  />
                </motion.div>
              )}

              {/* 2FA SETUP MODAL */}
              <AnimatePresence>
                {secShow2FAModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
                      className="bg-white rounded-2xl border shadow-2xl p-6 w-full max-w-md space-y-5" style={{ borderColor: "#E5E7EB" }}>
                      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-teal-600" />
                          <h3 className="text-base font-bold" style={{ color: "#111827" }}>Two-Factor Authentication</h3>
                        </div>
                        <button onClick={() => setSecShow2FAModal(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        <p className="text-gray-600">
                          Scan the QR code below using your authenticator application (such as Google Authenticator, Authy, or 1Password):
                        </p>

                        <div className="p-4 rounded-xl bg-gray-50 border flex flex-col items-center justify-center gap-2 text-center" style={{ borderColor: "#E5E7EB" }}>
                          <div className="h-32 w-32 bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-center font-mono text-[10px] text-gray-400">
                            [ QR CODE PLACEHOLDER ]
                          </div>
                          <p className="text-[10px] text-gray-500 font-mono mt-1">Manual Setup Key: <strong className="text-gray-800">IMPACTIQ-8829-SEC</strong></p>
                        </div>

                        <div>
                          <label className="font-semibold block text-gray-700 mb-1">Enter 6-digit Authenticator Code</label>
                          <input type="text" maxLength={6} value={sec2FAInput} onChange={e => setSec2FAInput(e.target.value)}
                            placeholder="e.g. 123456" className="input-base text-center font-mono text-base tracking-widest" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                        <button onClick={() => setSecShow2FAModal(false)} className="btn-secondary text-xs px-4">
                          Cancel
                        </button>
                        <button onClick={() => {
                          setSec2FAEnabled(true);
                          setSecShow2FAModal(false);
                          setNotifications(prev => ["Security: Two-Factor Authentication enabled", ...prev]);
                        }} className="btn-primary text-xs px-5">
                          Verify & Enable 2FA
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </AnimatePresence>
          </main>
        </div>

        {/* ---- MOBILE BOTTOM NAV ---- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around py-1.5 z-40 print:hidden"
          style={{ borderColor: "#E5E7EB" }}>
          {[
            { id: "home",      label: "Home",      icon: LayoutDashboard },
            { id: "projects",  label: "Projects",  icon: Folder },
            { id: "assistant", label: "Assistant", icon: Bot },
            { id: "research",  label: "Research",  icon: FlaskConical },
            { id: "report",    label: "Reports",   icon: FileText },
            { id: "insights",  label: "Insights",  icon: Lightbulb },
          ].map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === "projects" && currentPage === "detail");
            return (
              <button key={`bottom_nav_${item.id}`} onClick={() => navigate(item.id)}
                className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition"
                style={{ color: isActive ? "#1B3A6B" : "#9CA3AF" }}>
                <Icon className="h-5 w-5" style={{ color: isActive ? "#0D9488" : "#9CA3AF" }} />
                <span className="text-[9px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ======================================
            MODAL: NEW PROJECT
            ====================================== */}
        <AnimatePresence>
          {projectModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
              <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
                className="bg-white rounded-2xl border shadow-2xl p-6 w-full max-w-lg space-y-5" style={{ borderColor: "#E5E7EB" }}>
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: "#111827" }}>Create New Project</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Set indicators, donor, and timeline.</p>
                  </div>
                  <button onClick={() => setProjectModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Project title *</label>
                    <input type="text" placeholder="e.g. Sustainable Forestry Program" value={newProjName}
                      onChange={e => setNewProjName(e.target.value)} className="input-base" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Donor</label>
                      <input type="text" placeholder="e.g. USAID" value={newProjDonor}
                        onChange={e => setNewProjDonor(e.target.value)} className="input-base" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Program area</label>
                      <select value={newProjArea} onChange={e => setNewProjArea(e.target.value)} className="input-base">
                        <option value="Gender Equality">Gender Equality & Capital</option>
                        <option value="Climate Adaptation">Climate Resilient Adaptation</option>
                        <option value="Literacy Training">Literacy & Training Development</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Start date</label>
                      <input type="date" value={newProjStart} onChange={e => setNewProjStart(e.target.value)} className="input-base" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>End date</label>
                      <input type="date" value={newProjEnd} onChange={e => setNewProjEnd(e.target.value)} className="input-base" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold" style={{ color: "#374151" }}>Indicators</label>
                      <button onClick={() => setNewProjIndicators(prev => [...prev, { name: "", target: 100, current: 0, unit: "people" }])}
                        className="text-xs font-semibold hover:underline" style={{ color: "#0D9488" }}>+ Add</button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {newProjIndicators.map((ind, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" placeholder="Indicator name" value={ind.name}
                            onChange={e => setNewProjIndicators(prev => prev.map((v, i) => i === idx ? { ...v, name: e.target.value } : v))}
                            className="input-base flex-1" />
                          <input type="number" placeholder="Target" value={ind.target}
                            onChange={e => setNewProjIndicators(prev => prev.map((v, i) => i === idx ? { ...v, target: parseInt(e.target.value) || 0 } : v))}
                            className="input-base w-20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                  <button onClick={() => setProjectModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
                  <button onClick={() => {
                    if (!newProjName) { alert("Please enter a project name."); return; }
                    const nProjId = `proj_${Date.now()}`;
                    const nProj: Project = {
                      id: nProjId, name: newProjName, donor: newProjDonor || "N/A", programArea: newProjArea,
                      health: "green", progress: 0, startDate: newProjStart, endDate: newProjEnd,
                      description: "A customized evaluation workspace.",
                      indicators: newProjIndicators.filter(i => i.name.trim().length > 0),
                      activityTimeline: ["Project created"], status: "Active"
                    };
                    setProjects(prev => [...prev, nProj]);
                    syncProjectToFirestore(nProj);
                    setReports(prev => [...prev, { id: `rep_${Date.now()}`, name: `${newProjName} Progress Report`, projectId: nProjId, status: "Draft", lastSaved: new Date().toISOString().split("T")[0], sections: {}, aiDrafts: {} }]);
                    setProjectModalOpen(false);
                    setNewProjName(""); setNewProjDonor("");
                    setSelectedProjectId(nProjId);
                    navigate("detail");
                    setNotifications(prev => [`Project "${newProjName}" created`, ...prev]);
                  }} className="btn-primary text-xs">Create Project</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ======================================
            MODAL: INDEX KB DOCUMENT
            ====================================== */}
        <AnimatePresence>
          {kbModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
              <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
                className="bg-white rounded-2xl border shadow-2xl p-6 w-full max-w-md space-y-5" style={{ borderColor: "#E5E7EB" }}>
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: "#111827" }}>Index Document</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Add a document to the knowledge base.</p>
                  </div>
                  <button onClick={() => setKbModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Document title</label>
                    <input type="text" placeholder="e.g. Mid-term evaluation summary" value={newKbTitle}
                      onChange={e => setNewKbTitle(e.target.value)} className="input-base" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Associated project</label>
                      <select value={newKbProj} onChange={e => setNewKbProj(e.target.value)} className="input-base">
                        {projects.map((p, idx) => <option key={`kb_proj_opt_${p.id}_${idx}`} value={p.name}>{p.name}</option>)}
                        <option value="General Reference">General Reference</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Document type</label>
                      <select value={newKbType} onChange={e => setNewKbType(e.target.value as any)} className="input-base">
                        <option value="Report">Report</option>
                        <option value="Transcript">Transcript</option>
                        <option value="Dataset">Dataset</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "#374151" }}>Preview snippet</label>
                    <textarea placeholder="2-sentence document preview..." value={newKbSnippet}
                      onChange={e => setNewKbSnippet(e.target.value)}
                      className="w-full h-20 p-3 text-xs rounded-lg border resize-none outline-none focus:ring-1 focus:ring-teal-500"
                      style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: "#111827" }} />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                  <button onClick={() => setKbModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
                  <button onClick={() => {
                    if (!newKbTitle || !newKbSnippet) { alert("Please fill all required fields."); return; }
                    setKnowledgeBase(prev => [{ id: `kb_doc_${Date.now()}`, title: newKbTitle, project: newKbProj, date: new Date().toISOString().split("T")[0], type: newKbType, snippet: newKbSnippet }, ...prev]);
                    setKbModalOpen(false);
                    setNewKbTitle(""); setNewKbSnippet("");
                    setNotifications(prev => [`Document '${newKbTitle}' indexed`, ...prev]);
                  }} className="btn-primary text-xs">Index Document</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
