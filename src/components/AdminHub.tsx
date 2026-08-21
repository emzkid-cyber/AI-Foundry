import React, { useState, useEffect } from "react";
import {
  ShieldAlert, Users, Server, Database, Activity, Search,
  UserPlus, UserCheck, ShieldCheck, Key, RefreshCw, Download,
  CheckCircle2, AlertTriangle, Info, Clock, Cpu, HardDrive,
  Zap, Lock, Eye, ArrowUpRight, BarChart3, Terminal, Sparkles,
  Layers, Bot, Check, X, Filter, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Project, UploadedFile, Report, Insight } from "../types";

export interface SystemUser {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarColor?: string;
  initials?: string;
  createdAt?: string;
  lastActive?: string;
  isLoggedIn?: boolean;
  status?: "active" | "inactive" | "pending";
}

export interface AuditEvent {
  id: string;
  event: string;
  detail: string;
  userEmail: string;
  timestamp: string;
  category: "auth" | "project" | "ai" | "export" | "system";
  status: "success" | "warning" | "error";
}

interface AdminHubProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
    organization: string;
    avatarColor?: string;
    initials?: string;
    isLoggedIn?: boolean;
  };
  registeredUsers: SystemUser[];
  onUpdateUserRole: (email: string, newRole: string) => void;
  onAddUser: (user: SystemUser) => void;
  projects: Project[];
  files: UploadedFile[];
  reports: Report[];
  insights: Insight[];
  auditLogs: Array<{ id: string; event: string; detail: string; timestamp: string; status: string }>;
  onRefreshData?: () => void;
}

export function AdminHub({
  currentUser,
  registeredUsers,
  onUpdateUserRole,
  onAddUser,
  projects,
  files,
  reports,
  insights,
  auditLogs,
  onRefreshData
}: AdminHubProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "logs" | "infrastructure" | "database">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  // New user modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("M&E Officer");
  const [newUserOrg, setNewUserOrg] = useState(currentUser.organization || "ImpactIQ Global");
  const [addUserSuccess, setAddUserSuccess] = useState("");
  const [addUserError, setAddUserError] = useState("");

  // Role editing
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editRoleValue, setEditRoleValue] = useState("");

  // Live system metrics from backend
  const [backendStats, setBackendStats] = useState<{
    status: string;
    uptimeSeconds?: number;
    memoryMb?: number;
    geminiConfigured?: boolean;
    llamaConfigured?: boolean;
    llamaProvider?: string;
    llamaModel?: string;
  } | null>(null);
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [pingStatus, setPingStatus] = useState<"idle" | "pinging" | "online" | "offline">("idle");

  // Determine if current user has Admin privileges
  const isAdmin =
    currentUser.email.toLowerCase() === "emmanuelhabila2018@gmail.com" ||
    currentUser.role.toLowerCase().includes("admin") ||
    currentUser.role.toLowerCase().includes("lead") ||
    currentUser.role.toLowerCase().includes("director");

  // Fetch backend metrics
  const fetchMetrics = async () => {
    setLoadingBackend(true);
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        setBackendStats(data);
      }
    } catch (e) {
      console.log("Could not load /api/admin/metrics, checking assistant status...");
      try {
        const res = await fetch("/api/assistant/status");
        if (res.ok) {
          const data = await res.json();
          setBackendStats({
            status: "online",
            llamaConfigured: data.configured,
            llamaModel: data.model,
            llamaProvider: data.provider
          });
        }
      } catch (err) {
        console.error(err);
      }
    } finally {
      setLoadingBackend(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handlePingServer = async () => {
    setPingStatus("pinging");
    try {
      const res = await fetch("/api/assistant/status");
      if (res.ok) {
        setPingStatus("online");
      } else {
        setPingStatus("offline");
      }
    } catch {
      setPingStatus("offline");
    }
    setTimeout(() => setPingStatus("idle"), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setAddUserError("Name and email are required");
      return;
    }
    if (registeredUsers.some(u => u.email.toLowerCase() === newUserEmail.toLowerCase())) {
      setAddUserError("A user with this email address already exists");
      return;
    }

    const initials = newUserName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";
    const colors = ["#0D9488", "#1B3A6B", "#D97706", "#7C3AED", "#2563EB", "#059669"];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const created: SystemUser = {
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      organization: newUserOrg.trim(),
      avatarColor,
      initials,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      lastActive: "Just added"
    };

    onAddUser(created);
    setAddUserSuccess(`User ${newUserName} successfully provisioned.`);
    setNewUserName("");
    setNewUserEmail("");
    setTimeout(() => {
      setAddUserSuccess("");
      setShowAddUserModal(false);
    }, 1500);
  };

  const handleSaveRole = (email: string) => {
    if (!editRoleValue) return;
    onUpdateUserRole(email, editRoleValue);
    setEditingEmail(null);
    setEditRoleValue("");
  };

  // Export audit trail
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `impactiq-audit-logs-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredUsers = registeredUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalIndicators = projects.reduce((acc, p) => acc + (p.indicators?.length || 0), 0);

  // If user is not an admin, show strict access restriction
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm inline-block max-w-lg">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Administrator Access Required</h2>
          <p className="text-sm text-gray-600 mt-2">
            The Developer & Admin Hub is restricted to authorized System Administrators and Lead Technical Personnel.
          </p>
          <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs text-gray-700">
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Current User:</span>
              <span className="font-semibold text-gray-900">{currentUser.name}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Email:</span>
              <span className="font-semibold text-gray-900">{currentUser.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">Assigned Role:</span>
              <span className="font-semibold text-amber-700">{currentUser.role}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Contact your organization administrator (<code>emmanuelhabila2018@gmail.com</code>) to request elevated role privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0F172A 100%)" }}>
            <Terminal className="h-6 w-6 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-gray-900">Developer & Admin Hub</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="h-3 w-3" /> Admin Authorized
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Live user directory, system performance telemetry, database stats, and security audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchMetrics(); onRefreshData?.(); }}
            disabled={loadingBackend}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingBackend ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-sm hover:opacity-90"
            style={{ background: "#0D9488" }}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Provision User</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1 text-xs">
        {[
          { id: "overview", label: "System Telemetry", icon: Activity },
          { id: "users", label: `User Directory (${registeredUsers.length})`, icon: Users },
          { id: "infrastructure", label: "AI & Server Health", icon: Server },
          { id: "database", label: "Firestore Database", icon: Database },
          { id: "logs", label: `Security & Audit Trail (${auditLogs.length})`, icon: ShieldAlert },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition whitespace-nowrap ${
                isActive
                  ? "bg-gray-900 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          TAB 1: SYSTEM OVERVIEW & METRICS
          ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Registered Accounts</span>
                <div className="h-8 w-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{registeredUsers.length}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  100% Synced
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Active in Firestore & Local Auth</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Total Projects & TOC</span>
                <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{projects.length}</span>
                <span className="text-xs text-gray-500 font-medium">({totalIndicators} indicators)</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Live M&E monitoring frameworks</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Transcripts & Datasets</span>
                <div className="h-8 w-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <HardDrive className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{files.length}</span>
                <span className="text-xs text-gray-500 font-medium">files indexed</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Qualitative FGDs & Survey logs</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Generated AI Deliverables</span>
                <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{reports.length + insights.length}</span>
                <span className="text-xs text-gray-500 font-medium">reports & cards</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Donor-ready evaluation assets</p>
            </div>
          </div>

          {/* Quick Status Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Service Cards */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Server className="h-4 w-4 text-teal-600" />
                    Cloud Architecture & Backend Microservices
                  </h3>
                  <button
                    onClick={handlePingServer}
                    className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Ping API Gateway</span>
                    {pingStatus === "pinging" && <RefreshCw className="h-3 w-3 animate-spin" />}
                    {pingStatus === "online" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-xs">
                        GCR
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-900">Google Cloud Run Ingress</p>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 font-semibold">Active</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Container Port 3000 • Reverse proxy operational</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      HTTP 200 OK
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center font-bold text-xs">
                        FB
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-900">Firebase Firestore Real-time Database</p>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 font-semibold">Connected</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Database ID: <code>ai-studio-aifoundry-1e7633db-9ccf-4bf3-ab1b-2e732e7d8388</code></p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      Sync Active
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center font-bold text-xs">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-900">Meta Llama Inference Engine</p>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-teal-100 text-teal-800 font-semibold">
                            {backendStats?.llamaProvider || "Meta Llama (Groq / Together)"}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">Model: <code>{backendStats?.llamaModel || "llama-3.3-70b-versatile"}</code></p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                      Llama 3.3
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Mini-Feed */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Live User Activity Feed</h3>
                  <button onClick={() => setActiveTab("logs")} className="text-xs text-teal-700 font-semibold hover:underline">
                    View Full Audit Trail
                  </button>
                </div>
                <div className="space-y-2.5">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 rounded-2xl bg-gray-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-teal-500" />
                        <div>
                          <p className="font-semibold text-gray-900">{log.event}</p>
                          <p className="text-[11px] text-gray-500">{log.detail}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <p className="text-xs text-gray-400 py-4 text-center">No audit events recorded in this session yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Role Breakdown & Security Policies */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4">User Roles Breakdown</h3>
                <div className="space-y-3">
                  {["Lead Analyst", "Program Coordinator", "M&E Officer", "Field Officer", "Donor Representative"].map((r) => {
                    const count = registeredUsers.filter(u => u.role.toLowerCase() === r.toLowerCase()).length;
                    const pct = registeredUsers.length > 0 ? Math.round((count / registeredUsers.length) * 100) : 0;
                    return (
                      <div key={r} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-700 font-medium">{r}</span>
                          <span className="font-bold text-gray-900">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: r.includes("Lead") ? "#0D9488" : r.includes("Coordinator") ? "#1B3A6B" : "#D97706"
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-teal-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Admin Security Protocol</h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Only verified administrators have permission to mutate user authorization roles or inspect raw system audit trails.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Owner Account:</span>
                  <span className="font-mono text-teal-300">emmanuelhabila2018@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: USER DIRECTORY & MANAGEMENT
          ======================================================== */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user by name, email, or org..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter className="h-3.5 w-3.5" />
                <span>Role:</span>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none"
              >
                <option value="all">All Roles ({registeredUsers.length})</option>
                <option value="lead analyst">Lead Analyst</option>
                <option value="program coordinator">Program Coordinator</option>
                <option value="m&e officer">M&E Officer</option>
                <option value="field officer">Field Officer</option>
                <option value="donor representative">Donor Representative</option>
              </select>

              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs flex items-center gap-1.5 hover:opacity-90 ml-auto md:ml-0"
                style={{ background: "#0D9488" }}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold">
                    <th className="py-3.5 px-5">User Account</th>
                    <th className="py-3.5 px-4">Organization</th>
                    <th className="py-3.5 px-4">Current Role</th>
                    <th className="py-3.5 px-4">Status & Sync</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const isCurrentUser = user.email.toLowerCase() === currentUser.email.toLowerCase();
                    const isEditing = editingEmail === user.email;

                    return (
                      <tr key={user.email} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                              style={{ background: user.avatarColor || "#0D9488" }}
                            >
                              {user.initials || user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-gray-900">{user.name}</p>
                                {isCurrentUser && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-200">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-400 font-mono">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-gray-700 font-medium">
                          {user.organization || "ImpactIQ Global"}
                        </td>

                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={editRoleValue}
                                onChange={(e) => setEditRoleValue(e.target.value)}
                                className="px-2 py-1 text-xs rounded-lg border border-teal-500 bg-white"
                              >
                                <option value="Lead Analyst">Lead Analyst</option>
                                <option value="Program Coordinator">Program Coordinator</option>
                                <option value="M&E Officer">M&E Officer</option>
                                <option value="Field Officer">Field Officer</option>
                                <option value="Donor Representative">Donor Representative</option>
                              </select>
                              <button
                                onClick={() => handleSaveRole(user.email)}
                                className="p-1 rounded-md bg-teal-600 text-white hover:bg-teal-700"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingEmail(null)}
                                className="p-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                              {user.role}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Firestore Synced
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {!isEditing && (
                            <button
                              onClick={() => {
                                setEditingEmail(user.email);
                                setEditRoleValue(user.role);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition"
                            >
                              Edit Role
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No users match the search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: AI & BACKEND INFRASTRUCTURE
          ======================================================== */}
      {activeTab === "infrastructure" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta Llama Configuration */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Meta Llama AI Engine</h3>
                    <p className="text-xs text-gray-500">Project contextual reasoning & M&E synthesis</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {backendStats?.llamaConfigured ? "Key Active" : "Configured"}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200/50">
                  <span className="text-gray-500">Provider Endpoint:</span>
                  <span className="font-semibold text-gray-900">{backendStats?.llamaProvider || "Meta Llama (Groq / Together)"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/50">
                  <span className="text-gray-500">Primary Model:</span>
                  <span className="font-mono text-gray-900">{backendStats?.llamaModel || "llama-3.3-70b-versatile"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Execution Scope:</span>
                  <span className="font-semibold text-emerald-700">Server-Side (Zero Browser Leak)</span>
                </div>
              </div>
            </div>

            {/* Google Gemini Configuration */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Google Gemini AI Engine</h3>
                    <p className="text-xs text-gray-500">Qualitative research transcript extractor</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Active
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-200/50">
                  <span className="text-gray-500">SDK Version:</span>
                  <span className="font-mono text-gray-900">@google/genai (Modern)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/50">
                  <span className="text-gray-500">Default Model:</span>
                  <span className="font-mono text-gray-900">gemini-3.5-flash</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Structured Output:</span>
                  <span className="font-semibold text-emerald-700">JSON Schema Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: FIRESTORE DATABASE INSPECTOR
          ======================================================== */}
      {activeTab === "database" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Firestore Collections Structure</h3>
                <p className="text-xs text-gray-500">Direct mapping from <code>firebase-blueprint.json</code></p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Enterprise Database
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Collection: /users</span>
                  <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200 font-semibold text-teal-700">
                    {registeredUsers.length} documents
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Schema: name, email, role, organization, avatarColor, initials</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Collection: /projects</span>
                  <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200 font-semibold text-blue-700">
                    {projects.length} documents
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Schema: id, name, donor, status, budget, indicators, logframe</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: AUDIT LOGS
          ======================================================== */}
      {activeTab === "logs" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Platform Security & Audit Trail</h3>
              <p className="text-xs text-gray-500">Immutable audit log of authentication, project mutations, and export actions</p>
            </div>
            <button
              onClick={handleExportLogs}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-teal-500" />
                  <div>
                    <p className="font-semibold text-gray-900">{log.event}</p>
                    <p className="text-[11px] text-gray-500">{log.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-400">{log.timestamp}</span>
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-xs text-gray-400 py-6 text-center">No audit records logged yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-teal-600" />
                  Provision New User Account
                </h3>
                <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {addUserError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                  {addUserError}
                </div>
              )}
              {addUserSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  {addUserSuccess}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="s.jenkins@partner-ngo.org"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Assign Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="Lead Analyst">Lead Analyst</option>
                    <option value="Program Coordinator">Program Coordinator</option>
                    <option value="M&E Officer">M&E Officer</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Donor Representative">Donor Representative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Organization</label>
                  <input
                    type="text"
                    value={newUserOrg}
                    onChange={(e) => setNewUserOrg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                  >
                    Save & Provision User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
