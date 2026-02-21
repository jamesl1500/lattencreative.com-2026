/* ─── Bookings ─── */
export interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  company: string | null;
  package_id: string | null;
  package_title: string | null;
  package_price: number | null;
  deposit_percent: number | null;
  deposit_amount: number | null;
  preferred_date: string | null;
  preferred_time: string | null;
  project_description: string | null;
  budget_range: string | null;
  timeline: string | null;
  referral_source: string | null;
  status: "pending" | "confirmed" | "deposit_paid" | "in_progress" | "completed" | "cancelled";
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  created_at: string;
  updated_at: string;
}

/* ─── Clients ─── */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  notes: string | null;
  status: "lead" | "active" | "inactive" | "archived";
  source: "booking" | "contact_form" | "manual" | "referral";
  booking_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientInsert {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  notes?: string;
  status?: Client["status"];
  source?: Client["source"];
  booking_id?: string;
}

/* ─── Projects ─── */
export interface Project {
  id: string;
  title: string;
  description: string | null;
  client_id: string;
  booking_id: string | null;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  budget: number | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  client?: Client;
}

export interface ProjectInsert {
  title: string;
  description?: string;
  client_id: string;
  booking_id?: string;
  status?: Project["status"];
  priority?: Project["priority"];
  budget?: number;
  start_date?: string;
  due_date?: string;
}

/* ─── Tasks ─── */
export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  project?: Project;
}

export interface TaskInsert {
  title: string;
  description?: string;
  project_id: string;
  status?: Task["status"];
  priority?: Task["priority"];
  due_date?: string;
  sort_order?: number;
}

/* ─── Contacts ─── */
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

/* ─── Activity Log ─── */
export interface ActivityLog {
  id: string;
  entity_type: "booking" | "client" | "project" | "task" | "contact";
  entity_id: string;
  action: string;
  details: string | null;
  created_at: string;
}

/* ─── Dashboard Stats ─── */
export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  activeClients: number;
  activeProjects: number;
  pendingTasks: number;
  unreadContacts: number;
}
