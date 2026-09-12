export interface ApplyLeavePayload {
  id?: number | null;
  leaveTypeId: number | null;
  fromDate: string; // Date in "DD/MM/YYYY" format
  toDate: string; // Date in "DD/MM/YYYY" format
  reason: string;
  userId?: number;
  createdBy?: number;
  noOfDays?: number | null;
  document?: any;
  status?: string;
}
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface LeaveType {
  id: number;
  name: string;
  no_of_leaves: number;
}

export interface AppliedLeaveData {
  id: number;
  user_id: number;
  leave_type_id: number;
  from_date: string;
  to_date: string;
  document: string | null;
  reason: string;
  status: string;
  user: User;
  leaveType: LeaveType;
  remark: string | null;
  created_by: number;
  created_date: string;
  modified_by: number;
  modified_date: string;
}
export interface ApplyLeaveDataType {
  id?: number | null; // Unique identifier
  type: string; // Type of leave, e.g., Sick, Personal
  fromDate?: string; // Start date of the leave in ISO format
  toDate?: string;
  noOfDays?: number | null; // Number of leave days
  status: 'pending' | 'approved' | 'rejected' | 'canceled'; // Leave status
  reason?: string;
  document: string;
}
export interface LeaveRequestType {
  id: number | null; // Unique identifier for the leave request
  name: string; // Employee name
  todate: string; // Date of the request
  fromDate: string; // Starting date of the leave
  noOfDays: number | null; // Number of days requested for leave
  reason: string;
  status?: string;
  leaveType?: string;
}
