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

export const insertPlanRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/plan/InsertPlan', reqData)
    .then((response) => response.data);
};

export const updatePlanRequest = (
  planId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/plan/UpdatePlan/${planId}`, reqData)
    .then((response) => response.data);
};

export const updatePlanStatusRequest = (
  planId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/plan/UpdatePlanStatus/${planId}`, reqData)
    .then((response) => response.data);
};

export const updatePlanVisibilityRequest = (
  planId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/plan/UpdatePlanVisibility/${planId}`, reqData)
    .then((response) => response.data);
};

export const deletePlanRequest = (
  planId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/plan/DeletePlan/${planId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getPlanByIdRequest = (planId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/plan/GetPlanById/${planId}`)
    .then((response) => response.data);
};

export const getPlansRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/plan/GetPlans')
    .then((response) => response.data);
};

export const getActivePlansRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/plan/GetActivePlans')
    .then((response) => response.data);
};
