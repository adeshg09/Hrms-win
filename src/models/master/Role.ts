export interface RoleModel {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  created_by: number;
  created_date: string;
}

export interface ShortRoleModel {
  id: number;
  name: string;
}
