/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to user.
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

export const registerUserRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/user/RegisterUser', reqData)
    .then((response) => response.data);
};

export const updateUserRequest = (
  userId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/user/UpdateUser/${userId}`, reqData)
    .then((response) => response.data);
};

export const updateUserStatusRequest = (
  userId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/user/UpdateUserStatus/${userId}`, reqData)
    .then((response) => response.data);
};

export const deleteUserRequest = (
  userId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/user/DeleteUser/${userId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getUserByIdRequest = (userId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/user/GetUserById/${userId}`)
    .then((response) => response.data);
};

export const getUsersRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/user/GetUsers')
    .then((response) => response.data);
};

export const getUsersByCompanyIdRequest = (companyId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/user/GetUsersByCompanyId/${companyId}`)
    .then((response) => response.data);
};
