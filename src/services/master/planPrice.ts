/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to plan price.
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

export const insertPlanPriceRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/planPrice/InsertPlanPrice', reqData)
    .then((response) => response.data);
};

export const updatePlanPriceRequest = (
  planPriceId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/planPrice/UpdatePlanPrice/${planPriceId}`, reqData)
    .then((response) => response.data);
};

export const deletePlanPriceRequest = (planPriceId: number): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/planPrice/DeletePlanPrice/${planPriceId}`)
    .then((response) => response.data);
};

export const getPlanPriceByIdRequest = (planPriceId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/planPrice/GetPlanPriceById/${planPriceId}`)
    .then((response) => response.data);
};

export const getPlanPricesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/planPrice/GetPlanPrices')
    .then((response) => response.data);
};
