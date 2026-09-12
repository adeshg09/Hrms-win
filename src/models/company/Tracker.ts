import { ShortProjectModel } from './Project';

export interface TrackerDetailModel {
  id: number;
  capture_time: string;
  screen_shot: string | null;
  click_count: number;
  key_count: number;
  created_date: string;
}

export interface TrackerModel {
  id: number;
  task_summary: string;
  start_date: string;
  end_date: string;
  workingTime: string;
  idealTime: string;
  trackerProject: ShortProjectModel;
  trackerDetail: Array<TrackerDetailModel>;
}

export interface UserProjectTrackerModel {
  id: number;
  first_name: string;
  last_name: string;
  profile_photo: string;
  totalWorkingTime: string;
  totalIdealTime: string;
  trackers: Array<TrackerModel>;
}

interface EmployeeTrackDetail {
  capture_time: string;
  click_count: number;
  created_date: string;
  deleted_date: string | null;
  id: number;
  is_deleted: boolean;
  key_count: number;
  screen_shot: string;
  tracker_id: number;
}

export interface EmployeeTrack {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  trackers: Array<{
    deleted_date: string | null;
    end_date: string;
    id: number;
    is_deleted: boolean;
    project_id: number;
    start_date: string;
    task_summary: string;
    tr_project: {
      id: number;
      name: string;
      description: string;
      project_manager: number;
      team_leader: number;
    };
    tr_tracker_details: EmployeeTrackDetail[];
    tr_user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    };
  }>;
}

export interface ProjectData {
  projectName: string;
  id: number;
  projects: {
    [key: number]: {
      deleted_date: null | string;
      end_date: string;
      id: number;
      is_deleted: boolean;
      project_id: number;
      start_date: string;
      task_summary: string;
      tr_project: {
        id: number;
        name: string;
        description: string;
        project_manager: number;
        team_leader: number;
      };
      tr_tracker_details: EmployeeTrackDetail[];
      tr_user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
      };
      user_id: number;
    };
  };
}
