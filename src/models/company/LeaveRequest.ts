export interface AllLeaveRequest {
  id: number;
  user_id: number;
  leave_type_id: number;
  from_date: string; // ISO date string
  to_date: string; // ISO date string
  document: string | null;
  reason: string;
  status: 'pending' | 'approved' | 'rejected'; // Define the possible status values
  remark: string | null;
  created_by: number;
  created_date: string; // ISO date-time string
  modified_by: number;
  modified_date: string; // ISO date-time string
}

export interface LeaveRequestDraft {
  id: number | null;
  name: string;
  leaveName: string;
  leave_type_id: number | null;
  from_date: string; // Default to an empty string, will hold an ISO date string
  to_date: string; // Default to an empty string, will hold an ISO date string
  document?: any;
  reason: string; // Default to an empty string
  remark?: string | null;
  status: string; // Default to "pending"
}
