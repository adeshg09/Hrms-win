/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to tracker detail.
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

export const insertTrackerDetailRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/company/trackerDetail/InsertTrackerDetails', reqData)
    .then((response) => response.data);
};

export const updateTrackerDetailRequest = (
  trackerDetailId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `/admin/company/trackerDetail/UpdateTrackerDetails/${trackerDetailId}`,
      reqData
    )
    .then((response) => response.data);
};

export const deleteTrackerDetailRequest = (
  trackerDetailId: number
): Promise<any> => {
  return axiosInstance
    .delete(
      `/admin/company/trackerDetail/DeleteTrackerDetails/${trackerDetailId}`
    )
    .then((response) => response.data);
};

export const getTrackerDetailByIdRequest = (
  trackerDetailId: number
): Promise<any> => {
  return axiosInstance
    .get(
      `/admin/company/trackerDetail/GetTrackerDetailsById/${trackerDetailId}`
    )
    .then((response) => response.data);
};

export const getTrackerDetailsRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/trackerDetail/GetTrackerDetails')
    .then((response) => response.data);
};
