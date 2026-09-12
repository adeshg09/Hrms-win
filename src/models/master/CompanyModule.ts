import { ShortCompanySubModuleModel } from './CompanySubModule';

interface CompanyModule {
  id: number;
  name: string;
  display_name: string;
  summary: string;
  created_date: string;
  modified_date: string | null;
}

export interface CompanyModuleModel {
  id: number;
  name: string;
  display_name: string | null;
  summary: string | null;
  parent_id: number | null;
  sub_modules: Array<ShortCompanySubModuleModel>;
  modules?: CompanyModule[];
  created_by: number;
  created_date: string;
}

export interface ShortCompanyModuleModel {
  id: number;
  display_name: string;
}

export interface CompanyModuleFormValues {
  txtModuleName: string;
  txtDisplayName: string;
  txtSummary: string;
  ddlParentModule: number | null;
  ddlSubModule: Array<number>;
}
