/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to module.
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

export const insertModuleRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/module/InsertModule', reqData)
    .then((response) => response.data);
};

export const updateModuleRequest = (
  moduleId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/module/UpdateModule/${moduleId}`, reqData)
    .then((response) => response.data);
};

export const deleteModuleRequest = (
  moduleId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/module/DeleteModule/${moduleId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getModuleByIdRequest = (moduleId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/module/GetModuleById/${moduleId}`)
    .then((response) => response.data);
};

export const getModulesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/module/GetModules')
    .then((response) => response.data);
};
