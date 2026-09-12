/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to designation.
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

export const getDocumentType = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/employeeDocumentType/GetEmployeeDocumentTypes')
    .then((response) => response.data);
};

export const deleteDocumentType = (documentTypeid: number): Promise<any> => {
  return axiosInstance
    .delete(
      `/admin/company/employeeDocumentType/DeleteEmployeeDocumentType/${documentTypeid}`
    )
    .then((response) => response.data);
};

export const getDocumentTypebyId = (documentTypeId: number): Promise<any> => {
  return axiosInstance
    .get(
      `/admin/company/employeeDocumentType/GetEmployeeDocumentTypeById/${documentTypeId}`
    )
    .then((response) => response.data);
};
export const updateDocumentTypeRequest = (
  documentTypeId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `/admin/company/employeeDocumentType/UpdateEmployeeDocumentType/${documentTypeId}`,
      reqData
    )
    .then((response) => response.data);
};

export const insertDocumentType = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post(
      '/admin/company/employeeDocumentType/InsertEmployeeDocumentType',
      reqData
    )
    .then((response) => response.data);
};
