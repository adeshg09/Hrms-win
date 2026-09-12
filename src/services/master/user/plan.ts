/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to plan for user module.
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

export const getPlanByIdRequest = (planId: number): Promise<any> => {
  return axiosInstance
    .get(`/user/master/plan/GetPlanByIdUserModule/${planId}`)
    .then((response) => response.data);
};

export const getPlansRequest = (): Promise<any> => {
  return axiosInstance
    .get('/user/plan/GetPlans')
    .then((response) => response.data);
};
