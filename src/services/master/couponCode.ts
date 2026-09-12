/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to coupon code.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const insertCouponCodeRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/couponCode/InsertCouponCode', reqData)
    .then((response) => response.data);
};

export const updateCouponCodeRequest = (
  couponCodeId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/couponCode/UpdateCouponCode/${couponCodeId}`, reqData)
    .then((response) => response.data);
};

export const updateCouponCodeStatusRequest = (
  couponCodeId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `/admin/master/couponCode/UpdateCouponCodeStatus/${couponCodeId}`,
      reqData
    )
    .then((response) => response.data);
};

export const deleteCouponCodeRequest = (
  couponCodeId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/couponCode/DeleteCouponCode/${couponCodeId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getCouponCodeByIdRequest = (
  couponCodeId: number
): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/couponCode/GetCouponCodeById/${couponCodeId}`)
    .then((response) => response.data);
};

export const getCouponCodesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/couponCode/GetCouponCodes')
    .then((response) => response.data);
};
