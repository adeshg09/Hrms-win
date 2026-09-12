import { ShortCompanyModuleModel } from './CompanyModule';
import { ShortPlanModel } from './Plan';

export interface CompanyModel {
  id: number;
  name: string;
  display_name: string;
  logo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pin_code: string | null;
  registered_email: string;
  domain_name: string;
  plan: ShortPlanModel | null;
  company_module_ids: Array<number>;
  user_count: number | null;
  start_date: string | null;
  end_date: string | null;
  start_month: number | null;
  is_active: boolean;
  created_by: number;
  created_date: string;
}

export interface ShortCompanyModel {
  id: number;
  name: string;
}

export interface AddCompanyFormValues {
  txtName: string;
  txtDisplayName: string;
  txtAddress: string;
  txtCountry: string;
  txtState: string;
  txtCity: string;
  txtPinCode: string;
  txtDomainName: string;
  fileLogo: File | string | null;
  chkIsActive: boolean;
  txtFirstName: string;
  txtLastName: string;
  txtRegisteredEmail: string;
  txtPassword?: string;
  txtConfirmPassword?: string;
  chkIsUserActive: boolean;
  ddlPlan: number | '';
  ddlPlanDuration: number | '';
  ddlModule: Array<number>;
  txtUserCount: number | '';
  txtStartDate: string;
  txtEndDate: string;
  ddlStartMonth: number | '';
}

export interface EditCompanyFormValues {
  txtName: string;
  txtDisplayName: string;
  txtAddress: string;
  txtCountry: string;
  txtState: string;
  txtCity: string;
  txtPinCode: string;
  fileLogo: File | string | null;
  chkIsActive: boolean;
  ddlPlan: number | '';
  ddlPlanDuration: number | '';
  ddlModule: Array<number>;
  txtUserCount: number | '';
  txtStartDate: string;
  txtEndDate: string;
  ddlStartMonth: number | '';
}
