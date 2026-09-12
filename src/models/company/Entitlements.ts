// Interface for the user object
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

// Interface for the leaveType object
export interface LeaveType {
  id: number;
  name: string;
  no_of_leaves: number;
}

// Main interface for the leave record
export interface EntitlementRecord {
  id: number;
  user_id: number;
  leave_type_id: number;
  total_entitled_leaves: number;
  leave_balance: number;
  start_date: string; // Use Date if you want to work with Date objects
  end_date: string; // Use Date if you want to work with Date objects
  created_by: number;
  created_date: string; // Use Date for Date objects
  modified_by: number | null;
  modified_date: string | null; // Use Date for Date objects
  user: User;
  leaveType: LeaveType;
}

export interface EntitlementPayload {
  nameSelection: number | null;
  leaveTypeId: number | null;
  startDate: string;
  endDate: string;
  totalEntitledLeaves: number | null;
}
