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

export const insertClientRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/company/client/InsertClient', reqData)
    .then((response) => response.data);
};

export const updateClientRequest = (
  clientId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/client/UpdateClient/${clientId}`, reqData)
    .then((response) => response.data);
};

export const deleteClientRequest = (
  clientId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/company/client/DeleteClient/${clientId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getClientByIdRequest = (clientId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/client/GetClientById/${clientId}`)
    .then((response) => response.data);
};

export const getClientsRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/client/GetClients')
    .then((response) => response.data);
};
