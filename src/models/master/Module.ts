export interface ModuleModel {
  id: number;
  name: string;
  display_name: string | null;
  summary: string | null;
  created_by: number;
  created_date: string;
}

export interface ShortModuleModel {
  id: number;
  display_name: string;
}

export interface ModuleFormValues {
  txtModuleName: string;
  txtDisplayName: string;
  txtSummary: string;
}
