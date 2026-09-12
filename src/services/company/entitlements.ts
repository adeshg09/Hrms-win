/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to entitlements
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

export const getAllEntitlements = async (): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/employeeLeave/GetAllEmployeeLeaves`)
    .then((response) => response.data);
};

export const addEntitlementLeaves = async (req: any): Promise<any> => {
  return axiosInstance
    .post(`/admin/company/employeeLeave/SaveEmployeeLeave`, req)
    .then((res) => res.data);
};

export const deleteEntitlements = async (id: number): Promise<any> => {
  return axiosInstance
    .delete(`/admin/company/employeeLeave/DeleteEmployeeLeave/${id}`)
    .then((res) => res.data);
};
