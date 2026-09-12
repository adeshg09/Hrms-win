import { ShortClientModel } from './Client';
import { ShortUserModel } from './User';

export interface ProjectModel {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  estimate_time: number;
  is_active: boolean;
  created_by: number;
  created_date: string;
  client: ShortClientModel | null;
  project_manager: ShortUserModel;
  team_leader: ShortUserModel;
  team_members: Array<ShortUserModel>;
}

export interface ShortProjectModel {
  id: number;
  name: string;
}

export interface ProjectFormValues {
  txtProjectName: string;
  txtDescription: string;
  ddlProjectManager: number | '';
  ddlTeamLeader: number | '';
  ddlTeamMembers: Array<number>;
  ddlClient: number | '';
  txtStartDate: string;
  txtEndDate: string;
  estimateTime: number | '';
  chkIsActive: boolean;
}
