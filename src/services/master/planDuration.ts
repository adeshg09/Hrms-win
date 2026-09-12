/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to plan duration.
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

export const insertPlanDurationRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/planDuration/InsertPlanDuration', reqData)
    .then((response) => response.data);
};

export const updatePlanDurationRequest = (
  planDurationId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `/admin/master/planDuration/UpdatePlanDuration/${planDurationId}`,
      reqData
    )
    .then((response) => response.data);
};

export const deletePlanDurationRequest = (
  planDurationId: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/planDuration/DeletePlanDuration/${planDurationId}`)
    .then((response) => response.data);
};

export const getPlanDurationByIdRequest = (
  planDurationId: number
): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/planDuration/GetPlanDurationById/${planDurationId}`)
    .then((response) => response.data);
};

export const getPlanDurationsRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/planDuration/GetPlanDurations')
    .then((response) => response.data);
};
