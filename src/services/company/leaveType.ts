/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to leave types.
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

export const fetchLeaveTypes = (): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/leaveType/GetLeaveTypes`)
    .then((response) => response.data);
};

export const addLeaveType = (requestData: any): Promise<any> => {
  return axiosInstance
    .post(`/admin/company/leaveType/InsertLeaveType`, requestData)
    .then((response) => response.data);
};

export const editLeaveType = (
  leaveTypeId: number,
  requestData: any
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/leaveType/UpdateLeaveType/${leaveTypeId}`, requestData)
    .then((response) => response.data);
};

export const deleteLeaveType = (leaveTypeId: number): Promise<any> => {
  return axiosInstance
    .delete(`admin/company/leaveType/DeleteLeaveType/${leaveTypeId}`)
    .then((response) => response.data);
};
