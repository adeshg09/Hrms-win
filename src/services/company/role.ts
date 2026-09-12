/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to role.
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

export const insertRoleRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/company/role/InsertRole', reqData)
    .then((response) => response.data);
};

export const updateRoleRequest = (
  roleId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/role/UpdateRole/${roleId}`, reqData)
    .then((response) => response.data);
};

export const deleteRoleRequest = (
  roleId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/company/role/DeleteRole/${roleId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getRoleByIdRequest = (roleId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/role/GetRoleById/${roleId}`)
    .then((response) => response.data);
};

export const getRolesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/role/GetRoles')
    .then((response) => response.data);
};
