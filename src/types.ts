export interface Indicator {
  name: string;
  target: number;
  current: number;
  unit: string;
}

export interface Project {
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

export interface UploadedFile {
  id: string;
  name: string;
  projectId: string;
  type: "pdf" | "csv" | "xlsx" | "txt";
  size: string;
  uploadDate: string;
  status: "Processing" | "Ready" | "Error";
  content: string;
}

export interface Report {
  id: string;
  name: string;
  projectId: string;
  status: "Draft" | "In Review" | "Published";
  lastSaved: string;
  sections: Record<string, string>;
  aiDrafts: Record<string, string>;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  projectId: string;
  projectName: string;
  confidence: "High" | "Medium" | "Low";
}

export interface KBDoc {
  id: string;
  title: string;
  project: string;
  date: string;
  type: "Report" | "Transcript" | "Dataset";
  snippet: string;
}

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  role: string;
  organization: string;
  avatarColor: string;
  initials: string;
  createdAt?: string;
  lastActive?: string;
  status?: "active" | "inactive" | "pending";
}
