import { ShortModuleModel } from './Module';

export interface PlanModel {
  id: number;
  name: string;
  summary: string;
  modules: Array<ShortModuleModel>;
  description: string;
  actual_price: string | null;
  visible_price: string;
  is_visible: boolean;
  is_active: boolean;
  created_by: number;
  created_date: string;
}

export interface ShortPlanModel {
  id: number;
  name: string;
}
export interface PlanDurationModel {
  id: number;
  no_of_month: number;
  created_by: number;
  created_date: string;
}
export interface ShortPlanDurationModel {
  id: number;
  no_of_month: number;
}
export interface PlanPriceModel {
  id: number;
  plan: ShortPlanModel;
  plan_duration: ShortPlanDurationModel;
  price: string;
  created_by: number;
  created_date: string;
}
export interface PlanFormValues {
  txtName: string;
  txtSummary: string;
  txtDescription: string;
  ddlModule: Array<number>;
  txtActualPrice: string;
  txtVisiblePrice: string;
  chkIsVisible: boolean;
  chkIsActive: boolean;
}
export interface PlanDurationFormValues {
  numOfMonths: number | '' | null;
}

export interface PlanPriceFormValues {
  ddlPlan: string;
  ddlPlanDuration: string;
  txtPlanPrice: string;
}
