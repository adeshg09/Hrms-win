import { ShortRoleModel } from './Role';

export interface UserProfileModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  is_active: boolean;
  roles: Array<ShortRoleModel>;
  created_by: number;
  created_date: string;
}

export interface ShortUserModel {
  id: number;
  first_name: string;
  last_name: string;
}

export interface UserFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
}
