export interface RoleModel {
  id: number;
  name: string;
  subModules: Array<number>;
  description: string;
  is_public?: boolean;
  created_by: number;
  created_date: string;
}

export interface ShortRoleModel {
  id: number;
  name: string;
}

export interface RoleFormValues {
  txtRoleName: string;
  txtDescription: string;
  ddlSubModule: Array<number>;
}
