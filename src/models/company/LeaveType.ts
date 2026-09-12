export interface LeaveType {
  id: number;
  name: string;
  no_of_leaves: number;
  created_date: string;
}

export interface LeaveTypeDataType {
  id: number;
  name: string;
  number: number;
}

export interface LeaveTypeSubmit {
  id: number | null;
  txtLeaveTypeName: string;
  txtLeaveTypeNumber: number | null;
}
