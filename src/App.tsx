import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Folder, FlaskConical, FileText, Lightbulb,
  BookOpen, Search, Bell, Plus, Upload, Trash2, Edit2,
  Check, Download, AlertCircle, RefreshCw, X, Sparkles,
  ChevronRight, ArrowUpRight, HelpCircle, FileSpreadsheet, Lock, AlignLeft,
  User, LogOut, UserPlus, Shield, ChevronDown, TrendingUp,
  Calendar, Target, Activity, Layers, Settings, BarChart2,
  CheckCircle2, Clock, FileCheck, Menu, ArrowLeft, Eye, EyeOff,
  Globe, Mail, Building, Briefcase, Star, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
                <p className="text-xs text-gray-500">ImpactIQ Platform — Last updated July 2026</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 text-sm text-gray-600 space-y-5 leading-relaxed">
            <section>
              <h3 className="font-semibold text-gray-900 mb-2">1. Introduction</h3>
              <p>ImpactIQ ("we", "our", "the platform") is committed to protecting the privacy and security of data entrusted to us by non-governmental organizations, development agencies, and their authorized personnel. This Privacy Policy describes how we collect, use, store, and protect your information when you access or use the ImpactIQ platform.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">2. Data We Collect</h3>
              <p className="mb-2">We collect the following categories of information:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Data:</strong> Name, email address, organizational role, and affiliation provided during registration.</li>
                <li><strong>Program Data:</strong> Project indicators, evaluation datasets, FGD transcripts, survey data, and reports you upload or create within the platform.</li>
                <li><strong>Usage Data:</strong> Platform interactions, session activity, and feature usage analytics to improve the platform experience.</li>
                <li><strong>Device Data:</strong> Browser type, operating system, and device identifiers for security and compatibility purposes.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">3. How We Use Your Data</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide, operate, and improve the ImpactIQ platform and its AI-assisted features.</li>
                <li>To generate qualitative analysis, program insights, and donor reports using uploaded evaluation materials.</li>
                <li>To authenticate users and maintain secure workspace sessions.</li>
                <li>To send operational notifications relevant to your projects and evaluations.</li>
                <li>To comply with applicable legal and donor accountability obligations.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">4. AI Processing & Third-Party Services</h3>
              <p>ImpactIQ uses AI models (including Claude by Anthropic) to analyze qualitative data. When you use AI-assisted features, relevant content may be transmitted to third-party AI service providers under strict data processing agreements. We do not permit these providers to use your program data for training their models. All AI outputs are advisory and should be reviewed by qualified program staff before use in official donor reporting.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">5. Data Storage & Security</h3>
              <p>Your data is stored using industry-standard encryption at rest and in transit. We implement access controls, regular security audits, and secure session management. Program data is stored per your organization's workspace and is not shared with other organizations. Session data is persisted locally in your browser using localStorage.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">6. Data Retention</h3>
              <p>We retain your account and program data for the duration of your active subscription and up to 24 months after account deactivation to support audit and compliance requirements. You may request deletion of your data at any time by contacting our Data Protection Officer.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">7. Your Rights</h3>
              <p>Depending on your jurisdiction, you may have rights to access, rectify, erase, or port your personal data. To exercise these rights, contact: <strong>privacy@impactiq.org</strong>. We will respond to verifiable requests within 30 days.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">8. Children's Privacy</h3>
              <p>ImpactIQ is designed for professional use by authorized NGO personnel. We do not knowingly collect data from individuals under 18 years of age.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">9. Changes to This Policy</h3>
              <p>We may update this Privacy Policy periodically. Material changes will be communicated via platform notifications and email. Continued use of ImpactIQ after such changes constitutes acceptance of the updated policy.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">10. Contact</h3>
              <p>For privacy-related inquiries, contact our Data Protection Officer at <strong>privacy@impactiq.org</strong> or write to: ImpactIQ Global, 14 Development Way, Suite 300, Washington, D.C. 20001.</p>
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
      },
      {
        name: "Sarah Jenkins",
        email: "s.jenkins@usaid.gov",
        password: "impact2026",
        role: "Senior Donor Reviewer",
        organization: "USAID",
        avatarColor: "#8B5CF6",
        initials: "SJ"
      },
      {
        name: "Dr. Marcus Vance",
        email: "marcus.vance@unicef.org",
        password: "impact2026",
        role: "Field Evaluation Director",
        organization: "UNICEF",
        avatarColor: "#F59E0B",
        initials: "MV"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("impact_iq_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("impact_iq_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

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

  // --- NAVIGATION ---
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("empowerment");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([
    "Analysis completed on FGD_Transcript_June.pdf",
    "USAID indicator target reached 78%",
    "AI generated a new insight on Accounting Training gaps"
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // --- MAIN DATA ---
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "empowerment",
      name: "Women's Economic Empowerment Program",
      donor: "USAID",
      programArea: "Gender Equality",
      health: "green",
      progress: 75,
      startDate: "2026-01-15",
      endDate: "2026-12-31",
      description: "A comprehensive initiative targeting rural women to develop business skills, access micro-loans, and build sustainable local savings groups.",
      indicators: [
        { name: "% women with savings accounts", target: 60, current: 47, unit: "%" },
        { name: "Number of trainings delivered", target: 24, current: 18, unit: "sessions" },
        { name: "Number of beneficiaries reached", target: 500, current: 412, unit: "people" }
      ],
      activityTimeline: [
        "June 3, 2026: FGD Transcript uploaded by Sarah",
        "May 15, 2026: Mid-quarter survey completed",
        "April 10, 2026: Q1 Progress Report published"
      ],
      status: "Active"
    },
    {
      id: "climate",
      name: "Climate Resilient Agriculture Initiative",
      donor: "DFID",
      programArea: "Climate Adaptation",
      health: "amber",
      progress: 48,
      startDate: "2026-02-10",
      endDate: "2027-02-10",
      description: "Promoting drought-resistant methodologies, organic composting, and smart rainwater irrigation systems with smallholder rural farmers.",
      indicators: [
        { name: "Farmers adopting drought-resistant crops", target: 80, current: 35, unit: "%" },
        { name: "Rainwater harvesting containers deployed", target: 120, current: 65, unit: "units" }
      ],
      activityTimeline: [
        "May 28, 2026: Crop yield data sheet uploaded",
        "April 14, 2026: Baseline survey executed"
      ],
      status: "Active"
    }
  ]);

  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: "fgd_june",
      name: "FGD_Transcript_June.pdf",
      projectId: "empowerment",
      type: "pdf",
      size: "1.2 MB",
      uploadDate: "2026-06-03",
      status: "Ready",
      content: "First Focus Group transcription. Participants discussed high interest rates of old moneylenders (50%). Program savings groups solved this, but treasury record-keeping is still manual and difficult for some illiterate coordinators. 'Business ideas can change our lives, but we need simple paper ledgers to keep our trust, Participant Anna shared.'"
    },
    {
      id: "survey_q2",
      name: "Survey_Data_Q2.csv",
      projectId: "empowerment",
      type: "csv",
      size: "340 KB",
      uploadDate: "2026-06-02",
      status: "Ready",
      content: "Empowerment evaluation dataset: 154 women responded. Monthly average income increased by $28. 94% report higher self-confidence."
    }
  ]);

  const [reports, setReports] = useState<Report[]>([
    {
      id: "q2_report",
      name: "Q2 Progress Report",
      projectId: "empowerment",
      status: "Draft",
      lastSaved: "2026-06-04",
      sections: {
        "Executive Summary": "This report outlines key Q2 progress. 412 beneficiaries are active in savings groups.",
        "Background": "A USAID-funded program supporting financial autonomy among agrarian women groups.",
        "Methodology": "Mixed-methods evaluated via FGD transcripts (June) and Q2 quantitative surveys.",
        "Key Findings": "Savings accessibility improved drastically. However, accounting compliance is limited by basic literacy rates.",
        "Recommendations": "Implement visual LEDGER sheets and direct mobile tracking systems.",
        "Conclusion": "The model is durable. Scaling visual ledgers in Q3 will resolve compliance."
      },
      aiDrafts: {}
    }
  ]);

  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "ins_1",
      title: "Inter-Group Mentorship Emergence",
      summary: "Evaluations reveal mature savings circles are proactively guiding newly introduced circles in neighboring villages, amplifying training leverage by 1.8x without extra operational budgets.",
      projectId: "empowerment",
      projectName: "Women's Economic Empowerment Program",
      confidence: "High"
    },
    {
      id: "ins_2",
      title: "Accounting Stress Signals",
      summary: "While group trust is vital, basic literacy hurdles lead to book-keeping math errors. Treasurers indicate deep anxiety around audits, highlighting a structural need for visual tools.",
      projectId: "empowerment",
      projectName: "Women's Economic Empowerment Program",
      confidence: "Medium"
    },
    {
      id: "ins_3",
      title: "Immediate Capital Reinvestment",
      summary: "91% of loan withdrawals are funneled cleanly into income-generating crop trades instead of short-term domestic consumption, vastly outpacing original projections.",
      projectId: "empowerment",
      projectName: "Women's Economic Empowerment Program",
      confidence: "High"
    }
  ]);

  const [knowledgeBase, setKnowledgeBase] = useState<KBDoc[]>([
    {
      id: "kb_1",
      title: "Q1 Progress Evaluation - Women's Capital",
      project: "Women's Economic Empowerment Program",
      date: "2026-04-10",
      type: "Report",
      snippet: "Baseline indicators verified that 12 target circles are functional. Preliminary savings increased by 11% average."
    },
    {
      id: "kb_2",
      title: "June FGD Transcripts Raw Dialogue",
      project: "Women's Economic Empowerment Program",
      date: "2026-06-03",
      type: "Transcript",
      snippet: "Full qualitative transcription. Dialogues covering high-interest lenders, loan safety, and savings group ledger templates."
    },
    {
      id: "kb_3",
      title: "USAID Evaluation Standard Operating Guide 2026",
      project: "General Reference",
      date: "2025-11-20",
      type: "Report",
      snippet: "Framework guidance for designing indicator definitions, target baselines, and gender-transformative reporting frameworks."
    }
  ]);

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
  const [newKbProj, setNewKbProj] = useState<string>("Women's Economic Empowerment Program");
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
  } | null>({
    themes: [
      {
        theme: "Interest Rate Relief",
        summary: "Traditional local lenders impose high debts. Savings circles provided a safer source of agricultural liquidity.",
        quotes: ["'The savings group helped me buy fertilizer for my crops without a high-interest loan.'"],
        frequency: "High"
      },
      {
        theme: "Record-Keeping Literacy Demands",
        summary: "Illiteracy among group members interferes with precise, comfortable accounting, yielding high administrative anxiety.",
        quotes: ["'We need more training on accounting. While the money is safe, keeping records is hard.'"],
        frequency: "Medium"
      }
    ],
    findings: [
      "Access to cooperative savings groups has almost completely eliminated dependence on predatory village lending systems.",
      "A clear financial confidence transition is occurring, with beneficiary women expressing high self-reliance during village councils."
    ],
    recommendations: [
      "Deploy extremely simplified, icon-based ledger books for illiterate group coordinators.",
      "Coordinate mobile ledger pilots in rural program districts."
    ],
    summary: "Evaluation validates positive economic adaptation, hampered only by minor literacy bottlenecks in bookkeeping."
  });

  const [researchInputText, setResearchInputText] = useState<string>("");
  const [researchSelectedFiles, setResearchSelectedFiles] = useState<string[]>(["fgd_june"]);

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
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "content-type": "application/json", "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: "You are an expert qualitative research analyst for NGOs. Return ONLY a valid JSON object.",
            messages: [{
              role: "user",
              content: `Analyze this qualitative content. Return JSON:\n{"themes":[{"theme":"string","summary":"string","quotes":["string"],"frequency":"High|Medium|Low"}],"findings":["string"],"recommendations":["string"],"summary":"string"}\n\nText:\n${sourceContent}`
            }]
          })
        });
        if (!response.ok) throw new Error("API rejection");
        const resData = await response.json();
        const rawText = resData.content[0].text;
        const cleanJSON = rawText.substring(rawText.indexOf("{"), rawText.lastIndexOf("}") + 1);
        const parsed = JSON.parse(cleanJSON);
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
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "content-type": "application/json", "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: "You are an expert NGO donor report writer. Write clean professional sections in Markdown.",
            messages: [{
              role: "user",
              content: `Write a professional report section:\nSection: [${activeReportSection}]\nTone: [${reportTone}]\nProject: [${parentProj?.name} - ${parentProj?.description}]\nInsights: [${analysisWorkspace?.summary || ""}]\n\nWrite 2-3 specific, evidence-based paragraphs.`
            }]
          })
        });
        if (!response.ok) throw new Error("API rejection");
        const resData = await response.json();
        const textOut = resData.content[0].text;
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
    const parentProj = projects.find(p => p.id === selectedProjectId);
    const pName = parentProj?.name || "All Programs";
    const steps = ["Scanning evaluation files...", "Mining pattern vectors...", "Structuring insight cards..."];
    triggerQualitativeLoad(steps, async () => {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "content-type": "application/json", "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: "You are an expert NGO analyst. Return ONLY a valid JSON array.",
            messages: [{ role: "user", content: `Generate 3 evaluation insights for: ${pName}. JSON Array: [{"title":"string","summary":"string","confidence":"High|Medium|Low"}]` }]
          })
        });
        if (!response.ok) throw new Error("API rejection");
        const resData = await response.json();
        const rawText = resData.content[0].text;
        const cleanJSON = rawText.substring(rawText.indexOf("["), rawText.lastIndexOf("]") + 1);
        const parsed: any[] = JSON.parse(cleanJSON);
        const newIns: Insight[] = parsed.map((item, idx) => ({
          id: `ai_ins_${Date.now()}_${idx}`,
          title: item.title || "Community Assessment Insight",
          summary: item.summary || "High qualitative feedback highlights strong program implementation.",
          projectId: selectedProjectId,
          projectName: pName,
          confidence: item.confidence || "High"
        }));
        setInsights(prev => [...newIns, ...prev]);
      } catch (err) {
        const simulated: Insight[] = [
          { id: `sim_ins_1_${Date.now()}`, title: "Micro-Loan Capital Reinvestment Velocity", summary: "Recent ledger sheets reveal female beneficiaries are returning capital 14 days earlier than anticipated, utilizing rapid tomato-crop rotation cycles.", projectId: selectedProjectId, projectName: pName, confidence: "High" },
          { id: `sim_ins_2_${Date.now()}`, title: "Visual Audits Elevate Coordination Speed", summary: "Pilot testing of visual check-sheets in 2 local centers reduced the training ledger error rate by 84%, saving coordinators approximately 4 hours per month.", projectId: selectedProjectId, projectName: pName, confidence: "High" },
          { id: `sim_ins_3_${Date.now()}`, title: "Peer-to-Peer Training Replication Ratio", summary: "Every certified village coordinator is actively mentoring an average of 2.4 secondary beneficiaries, showcasing massive unpaid organic knowledge replication.", projectId: selectedProjectId, projectName: pName, confidence: "Medium" }
        ];
        setInsights(prev => [...simulated, ...prev]);
        setNotifications(prev => ["3 new insight cards generated from project variables", ...prev]);
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
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
                      <input
                        type="email" required autoComplete="email"
                        placeholder="you@organization.org"
                        value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        className="auth-input pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium" style={{ color: "#374151" }}>Password</label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
                      <input
                        type={showAuthPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        className="auth-input pl-9 pr-10"
                      />
                      <button type="button" onClick={() => setShowAuthPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showAuthPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={authLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition"
                    style={{ background: authLoading ? "#6B7280" : "#1B3A6B" }}>
                    {authLoading ? <><RefreshCw className="h-4 w-4 animate-spin" /> Signing in...</> : <><Lock className="h-4 w-4" /> Sign In</>}
                  </button>

                  {/* Quick access demo */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
                    <p className="text-xs font-medium mb-2" style={{ color: "#9CA3AF" }}>Demo Access — click to sign in:</p>
                    <div className="space-y-2">
                      {registeredUsers.slice(0, 3).map((u, i) => (
                        <button key={i} type="button"
                          onClick={() => {
                            setCurrentUser({ name: u.name, email: u.email, role: u.role, organization: u.organization || "NGO Partner", avatarColor: u.avatarColor, initials: u.initials, isLoggedIn: true });
                            setNotifications(prev => [`Welcome back, ${u.name}`, ...prev]);
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition group"
                          style={{ borderColor: "#E5E7EB", background: "#FAFAFA" }}>
                          <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: u.avatarColor }}>
                            {u.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: "#111827" }}>{u.name}</p>
                            <p className="text-[10px]" style={{ color: "#9CA3AF" }}>{u.role}</p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 ml-auto shrink-0 text-gray-400 group-hover:translate-x-0.5 transition" />
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* SIGN UP FORM */}
              {authMode === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Full name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
                      <input type="text" required placeholder="John Doe"
                        value={authName} onChange={e => setAuthName(e.target.value)}
                        className="auth-input pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Work email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
                      <input type="email" required placeholder="you@organization.org"
                        value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        className="auth-input pl-9" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Role</label>
                      <select value={authRole} onChange={e => setAuthRole(e.target.value)}
                        className="auth-input text-sm">
                        <option>Lead Analyst</option>
                        <option>Program Coordinator</option>
                        <option>Senior Advisor</option>
                        <option>Field Director</option>
                        <option>Donor Reviewer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Organization</label>
                      <input type="text" placeholder="Your NGO"
                        value={authOrg} onChange={e => setAuthOrg(e.target.value)}
                        className="auth-input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
                      <input type={showAuthPassword ? "text" : "password"} placeholder="Min. 6 characters"
                        value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        className="auth-input pl-9 pr-10" />
                      <button type="button" onClick={() => setShowAuthPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showAuthPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>Confirm password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
                      <input type="password" placeholder="Repeat password"
                        value={authConfirmPassword} onChange={e => setAuthConfirmPassword(e.target.value)}
                        className="auth-input pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#374151" }}>Avatar color</label>
                    <div className="flex gap-2">
                      {["#0D9488", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"].map(c => (
                        <button key={c} type="button" onClick={() => setAuthColor(c)}
                          className="h-7 w-7 rounded-full border-2 transition"
                          style={{ background: c, borderColor: authColor === c ? "#111827" : "transparent", transform: authColor === c ? "scale(1.15)" : "scale(1)" }} />
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={authLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition"
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
  const navItems = [
    { id: "home",     label: "Dashboard",      icon: LayoutDashboard },
    { id: "projects", label: "Projects",        icon: Folder },
    { id: "research", label: "Research Studio", icon: FlaskConical },
    { id: "report",   label: "Report Builder",  icon: FileText },
    { id: "insights", label: "AI Insights",     icon: Lightbulb },
    { id: "kb",       label: "Knowledge Base",  icon: BookOpen },
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
                <button key={item.id} onClick={() => navigate(item.id)}
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
              title={sidebarCollapsed ? "Profile & Settings" : ""}
              className={`nav-item ${currentPage === "profile" ? "active" : ""} ${sidebarCollapsed ? "justify-center" : ""}`}>
              <Settings className={`h-4 w-4 shrink-0 ${currentPage === "profile" ? "text-teal-600" : "text-gray-500"}`} />
              {!sidebarCollapsed && <span>Profile & Settings</span>}
            </button>
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
                      <button key={item.id} onClick={() => navigate(item.id)}
                        className={`nav-item ${isActive ? "active" : ""}`}>
                        <Icon className={`nav-icon h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : "text-gray-500"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="pt-2">
                    <button onClick={() => navigate("profile")} className={`nav-item ${currentPage === "profile" ? "active" : ""}`}>
                      <Settings className="h-4 w-4 shrink-0 text-gray-500" />
                      <span>Profile & Settings</span>
                    </button>
                  </div>
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
                    {navItems.find(n => n.id === currentPage)?.label || "Profile & Settings"}
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
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalSearch}
                  onChange={e => setGlobalSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 w-40 md:w-52"
                  style={{ background: "#F9FAFB", borderColor: "#E5E7EB", color: "#111827" }}
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
                          <div key={idx} className="px-4 py-3 hover:bg-gray-50 transition flex gap-2.5 items-start">
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
                        Good morning, {currentUser.name.split(" ")[0]} 👋
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
                        sub: "+1 this quarter",
                        subColor: "#10B981",
                        icon: Activity,
                        iconBg: "#EFF6FF",
                        iconColor: "#3B82F6",
                        accent: "#3B82F6"
                      },
                      {
                        label: "Reports Due",
                        value: 1,
                        sub: "June 30 deadline",
                        subColor: "#F59E0B",
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
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold" style={{ color: "#111827" }}>Active Initiatives</h2>
                        <button onClick={() => navigate("projects")}
                          className="text-xs font-semibold hover:underline" style={{ color: "#0D9488" }}>
                          View all
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map(proj => (
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
                        ))}
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
                          {insights.slice(0, 2).map(ins => (
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
                          ))}
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
                          {[
                            { title: "USAID Q2 Donor Draft", due: "June 30, 2026", urgent: true },
                            { title: "FGD Transcription Audit", due: "July 15, 2026", urgent: false }
                          ].map(d => (
                            <div key={d.title} className="p-2.5 rounded-lg" style={{ background: "#F9FAFB" }}>
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-semibold" style={{ color: "#111827" }}>{d.title}</p>
                                {d.urgent && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ background: "#FEF2F2", color: "#B91C1C" }}>Urgent</span>}
                              </div>
                              <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{d.due}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent datasets */}
                      <div className="metric-card">
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                          <Layers className="h-4 w-4" style={{ color: "#0D9488" }} />
                          Recent Datasets
                        </h3>
                        <div className="space-y-2">
                          {files.map(f => (
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
                          ))}
                        </div>
                      </div>

                      {/* Action log */}
                      <div className="metric-card">
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#111827" }}>
                          <Activity className="h-4 w-4" style={{ color: "#0D9488" }} />
                          Activity Log
                        </h3>
                        <div className="space-y-3">
                          {[
                            { actor: currentUser.name.split(" ")[0], action: "uploaded FGD_Transcript_June.pdf" },
                            { actor: "AI Engine", action: "synchronized 3 financial insight nodes" },
                            { actor: "System", action: "initialized PDF generation templates" }
                          ].map((entry, idx) => (
                            <div key={idx} className="timeline-item">
                              <strong style={{ color: "#111827" }}>{entry.actor}</strong>{" "}
                              <span style={{ color: "#6B7280" }}>{entry.action}</span>
                            </div>
                          ))}
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
                </motion.div>
              )}

              {/* ======================================
                  PAGE: PROJECT DETAIL
                  ====================================== */}
              {currentPage === "detail" && (
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
                    <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                      <span>Donor: <strong style={{ color: "#111827" }}>{currentProject.donor}</strong></span>
                      <span className="h-3 w-px bg-gray-200" />
                      <span>Progress: <strong style={{ color: "#111827" }}>{currentProject.progress}%</strong></span>
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
                        {analysisWorkspace && (
                          <button onClick={() => { alert("Findings formatted for report builder."); navigate("report"); }}
                            className="btn-secondary text-xs">
                            Push to Report <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
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
              {currentPage === "report" && (
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
                          <div key={idx} className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
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
                    {insights.map(ins => (
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
                    ))}
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
                    {filteredKnowledgeBase.map(doc => (
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
                    ))}

                    {filteredKnowledgeBase.length === 0 && (
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
                    )}
                  </div>
                </motion.div>
              )}

              {/* ======================================
                  PAGE: PROFILE & SETTINGS
                  ====================================== */}
              {currentPage === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5 max-w-5xl">
                  <div>
                    <h1 className="text-xl font-bold" style={{ color: "#111827", letterSpacing: "-0.02em" }}>Profile & Settings</h1>
                    <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Manage your account and workspace preferences.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Edit profile */}
                    <div className="lg:col-span-7 bg-white rounded-xl border p-6 space-y-6" style={{ borderColor: "#E5E7EB" }}>
                      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pb-5 border-b" style={{ borderColor: "#F3F4F6" }}>
                        <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0"
                          style={{ background: currentUser.avatarColor }}>
                          {currentUser.initials}
                        </div>
                        <div className="text-center sm:text-left">
                          <h3 className="text-base font-bold" style={{ color: "#111827" }}>{currentUser.name}</h3>
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
                        <label className="text-xs font-semibold block mb-2" style={{ color: "#374151" }}>Avatar color</label>
                        <div className="flex gap-2">
                          {["#0D9488", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"].map(c => (
                            <button key={c} onClick={() => { setCurrentUser(prev => ({ ...prev, avatarColor: c })); setRegisteredUsers(prev => prev.map(u => u.email.toLowerCase() === currentUser.email.toLowerCase() ? { ...u, avatarColor: c } : u)); }}
                              className="h-8 w-8 rounded-full border-2 transition"
                              style={{ background: c, borderColor: currentUser.avatarColor === c ? "#111827" : "transparent", transform: currentUser.avatarColor === c ? "scale(1.15)" : "scale(1)" }} />
                          ))}
                        </div>
                      </div>

                      {/* Danger zone */}
                      <div className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        style={{ background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#991B1B" }}>Sign Out</p>
                          <p className="text-xs mt-0.5" style={{ color: "#B91C1C" }}>This will end your current session securely.</p>
                        </div>
                        <button onClick={() => setCurrentUser(prev => ({ ...prev, isLoggedIn: false }))}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition"
                          style={{ background: "white", color: "#991B1B", border: "1px solid #FCA5A5" }}>
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
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
                        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Switch between team member sessions.</p>
                      </div>

                      <div className="space-y-2">
                        {registeredUsers.map((user, idx) => {
                          const isActive = user.email.toLowerCase() === currentUser.email.toLowerCase();
                          return (
                            <div key={idx}
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

                      <div className="pt-1 border-t" style={{ borderColor: "#F3F4F6" }}>
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
                          className="text-xs font-semibold flex items-center gap-1 hover:underline mt-3"
                          style={{ color: "#0D9488" }}>
                          <Plus className="h-3.5 w-3.5" /> Invite Teammate
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>

        {/* ---- MOBILE BOTTOM NAV ---- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around py-1.5 z-40 print:hidden"
          style={{ borderColor: "#E5E7EB" }}>
          {[
            { id: "home",     label: "Home",     icon: LayoutDashboard },
            { id: "projects", label: "Projects",  icon: Folder },
            { id: "research", label: "Research",  icon: FlaskConical },
            { id: "report",   label: "Reports",   icon: FileText },
            { id: "insights", label: "Insights",  icon: Lightbulb },
            { id: "kb",       label: "KB",        icon: BookOpen },
          ].map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === "projects" && currentPage === "detail");
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
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
                        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
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
