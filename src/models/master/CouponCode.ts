export interface CouponCodeModel {
  id: number;
  code: string;
  discount: number;
  is_percentage: boolean;
  max_discount: number | null;
  summary: string | null;
  description: string | null;
  is_active: boolean;
  created_by: number;
  created_date: string;
}

export interface ShortCouponCodeModel {
  id: number;
  code: string;
}

export interface CouponCodeFormValues {
  txtCode: string;
  txtDiscount: number | '' | null;
  chkIsPercentage: boolean;
  txtMaxDiscount: number | '' | null;
  txtSummary: string;
  txtDescription: string;
  chkIsActive: boolean;
}
