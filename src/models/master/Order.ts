import { ShortCompanyModel } from './Company';
import { ShortPlanModel } from './Plan';
import { ShortCouponCodeModel } from './CouponCode';

export interface OrderModel {
  id: number;
  company: ShortCompanyModel;
  plan: ShortPlanModel;
  user_count: number;
  duration: number;
  gross_total: string;
  discount: string;
  gst: string;
  total: string;
  coupon_code: ShortCouponCodeModel | null;
  is_addon: boolean;
  is_success: boolean;
  created_by: number;
  created_date: string;
}
