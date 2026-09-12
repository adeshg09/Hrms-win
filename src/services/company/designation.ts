/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to designation.
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

export const insertDesignationRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/company/designation/InsertDesignation', reqData)
    .then((response) => response.data);
};

export const updateDesignationRequest = (
  designationId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `/admin/company/designation/UpdateDesignation/${designationId}`,
      reqData
    )
    .then((response) => response.data);
};

export const deleteDesignationRequest = (
  designationId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/company/designation/DeleteDesignation/${designationId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getDesignationByIdRequest = (
  designationId: number
): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/designation/GetDesignationById/${designationId}`)
    .then((response) => response.data);
};

export const getDesignationsRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/designation/GetDesignations')
    .then((response) => response.data);
};
