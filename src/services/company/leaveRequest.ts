/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to leave request.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 26/Nov/2024
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

export const getAllLeaveRequest = (): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/leaveRequest/GetAllLeaveRequests`)
    .then((response) => response.data);
};
export const getAllLeavesById = (userId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/leaveRequest/GetAllLeaveRequestsByUserId/${userId}`)
    .then((res) => res.data);
};

export const updateLeaveRequest = (
  leaveRequestId: number,
  requestData: any
): Promise<any> => {
  return axiosInstance
    .put(
      `/admin/company/leaveRequest/UpdateLeaveRequestStatus/${leaveRequestId}`,
      requestData
    )
    .then((response) => response.data);
};

export const applyLeaveRequest = (requestData: any): Promise<any> => {
  return axiosInstance
    .post(`/admin/company/leaveRequest/InsertLeaveRequest`, requestData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => response.data);
};

export const editLeaveRequest = (
  id: number,
  requestData: any
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/leaveRequest/UpdateLeaveRequest/${id}`, requestData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => res.data);
};
