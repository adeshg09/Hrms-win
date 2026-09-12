export interface SubModuleModel {
  id: number;
  name: string;
  display_name: string | null;
  summary: string | null;
  created_by: number;
  created_date: string;
}

export interface CompanySubModuleModel {
  sub_module_id: number;
  sub_module_name: string;
  sub_module_display_name?: string;
}

export interface ShortCompanySubModuleModel {
  id: number;
  display_name: string;
}

export interface CompanySubModuleFormValues {
  txtSubModuleName: string;
  txtDisplayName: string;
  txtSummary: string;
}
