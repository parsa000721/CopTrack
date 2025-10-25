export enum Role {
  ADMIN = 'admin',
  STATION_OFFICER = 'station_officer',
  USER = 'user',
}

export enum Page {
    LOGIN = 'login',
    REGISTER = 'register',
    DASHBOARD = 'dashboard',
    REGISTER_DETAILS = 'register_details',
    USER_MANAGEMENT = 'user_management',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  stationId: string | null;
  stationName?: string;
  ssoId: string;
  email: string;
  mobile: string;
  designation: string;
}

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  FILE = 'file',
}

export interface RegisterField {
  id: string;
  label: string;
  label_hi: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select type
  options_hi?: string[]; // For select type
  options_map?: { id: string, name: string, name_hi: string }[]; // For select from complex objects
  optionsSourceRegisterId?: string;
  optionsSourceDisplayField?: string;
}

export interface Register {
  id: string;
  name: string;
  name_hi: string;
  fields: RegisterField[];
}

export type RecordData = {
  id: string;
  year: number;
  stationId: string;
  [key: string]: any;
};

export interface PoliceStation {
    id: string;
    name: string;
    isActive: boolean;
}

// FIX: Add missing Duty Chart type definitions.
// Types for Duty Chart
export interface DutyPersonnel {
  sno: number;
  name: string;
  designation: string;
  details: string;
  presence: 'P' | 'A' | 'D' | string; // Present, Absent, Deployed/Duty
}

export interface DutyAssignment {
  title: string;
  title_hi: string;
  officers: string[];
  subtext?: string;
  subtext_hi?: string;
}

export interface DutyRowAssignment {
  content: DutyAssignment;
  span: number;
}

export interface DutyRow {
  personnel: DutyPersonnel;
  assignments?: {
    col1?: DutyRowAssignment;
    col2?: DutyRowAssignment;
  };
}

export interface DutyChartData {
  date: string;
  personnel: DutyPersonnel[];
  assignments: DutyAssignment[];
  summary: {
    present: number;
    on_leave: number;
    absent: number;
    outstation_duty: number;
  };
}

export interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  text?: string;
  file?: string; // Base64 data URI
  fileName?: string;
  fileType?: string; // MIME type
  timestamp: number;
  read: boolean;
}

export enum NotificationType {
  CHAT = 'chat',
  TASK = 'task',
  SYSTEM = 'system',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  link?: string; // e.g., to navigate to the chat
  timestamp: number;
  read: boolean;
}

// FIX: Add missing ComparativeReport types.
export interface ComparativeReportHeader {
  key: string;
  label: string;
  label_hi: string;
  isSNo?: boolean;
  isTitle?: boolean;
}

export interface ComparativeReportRow {
  year: number;
  [key: string]: any;
}

export interface ComparativeReportItemGroup {
  id: string;
  title: string;
  title_hi: string;
  data: ComparativeReportRow[];
}

export interface ComparativeReport {
  title: string;
  title_hi: string;
  headers: ComparativeReportHeader[];
  itemGroups: ComparativeReportItemGroup[];
  totalsGroup: ComparativeReportItemGroup;
}