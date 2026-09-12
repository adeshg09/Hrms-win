/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to coupon code for user module.
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

export const getCouponCodeByIdRequest = (
  couponCodeId: number
): Promise<any> => {
  return axiosInstance
    .get(`/user/master/couponCode/GetCouponCodeById/${couponCodeId}`)
    .then((response) => response.data);
};

export const getCouponCodesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/user/master/couponCode/GetCouponCodesUserModule')
    .then((response) => response.data);
};
