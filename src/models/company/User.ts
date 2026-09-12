import { ShortRoleModel } from './Role';

export interface UserProfileModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  profile_photo: string | null;
  is_active: boolean;
  created_by: number | null;
  created_date: string;
  profile: ProfileModel;
  roles: Array<ShortRoleModel>;
}

export interface ProfileModel {
  employee_code: string | null;
  is_super_admin: boolean;
  designation_id: number | null;
  is_download: boolean;
  download_date: string | null;
  ip_address: string | null;
  last_login_version: string | null;
  last_login_date: string | null;
  show_activity: boolean;
}

export interface ShortUserModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword?: string;
  txtPhone?: string;
  txtEmployeeCode: string;
  ddlDesignation: number | '';
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;
}
