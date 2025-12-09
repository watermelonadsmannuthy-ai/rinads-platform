// Extended Types for ERP + Agency Features

import { Tenant, AppUser } from './types';

export type ClientStatus = 'active' | 'inactive' | 'trial' | 'cancelled';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type ContentPlatform = 'instagram' | 'facebook' | 'youtube' | 'reels' | 'linkedin' | 'twitter';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type UserRole = 'admin' | 'staff' | 'client' | 'visitor';

export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  plan?: string;
  status: ClientStatus;
  notes?: string;
  onboarding_status: string;
  onboarding_data?: Record<string, any>;
  assigned_staff_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  tenant_id: string;
  client_id?: string;
  staff_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  allocated_date?: string;
  status: TaskStatus;
  priority: TaskPriority;
  recurring?: string;
  recurring_pattern?: Record<string, any>;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Attendance {
  id: string;
  tenant_id: string;
  staff_id: string;
  date: string;
  time_in?: string;
  time_out?: string;
  duration_minutes?: number;
  device?: string;
  qr_verification_token?: string;
  verified: boolean;
  location?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContentCalendar {
  id: string;
  tenant_id: string;
  client_id?: string;
  title: string;
  scheduled_date: string;
  platform: ContentPlatform;
  caption?: string;
  hashtags?: string[];
  assets?: string[];
  status: string;
  ai_generated: boolean;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  client_id: string;
  invoice_number: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  pdf_url?: string;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_date?: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Lead {
  id: string;
  tenant_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  service_interest?: string[];
  status: LeadStatus;
  priority: TaskPriority;
  ai_score?: number;
  assigned_staff_id?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SystemLog {
  id: string;
  tenant_id?: string;
  user_id?: string;
  action_type: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AIConversation {
  id: string;
  tenant_id: string;
  user_id?: string;
  role: UserRole;
  messages: AIMessage[];
  context?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AutomationJob {
  id: string;
  tenant_id: string;
  job_type: string;
  status: string;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  result?: Record<string, any>;
  error_message?: string;
  created_at: string;
}

export interface StaffQRCode {
  id: string;
  tenant_id: string;
  staff_id: string;
  qr_token: string;
  qr_code_url?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

