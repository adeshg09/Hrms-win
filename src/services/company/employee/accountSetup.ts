/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';
// import { is } from 'date-fns/locale';

// ----------------------------------------------------------------------

export const registerUserRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/company/user/RegisterUser', reqData)
    .then((response) => response.data);
};

export const updateUserRequest = (
  userId: number | null,
  reqData: FormData,
  isUpdateRole: boolean
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/user/UpdateUser/${userId}`, {
      ...reqData,
      isUpdateRole
    })
    .then((response) => response.data);
};

export const updateUserStatusRequest = (
  userId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/user/UpdateUserStatus/${userId}`, reqData)
    .then((response) => response.data);
};

export const updateUserActivityStatusRequest = (
  userId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/user/UpdateUserActivityStatus/${userId}`, reqData)
    .then((response) => response.data);
};

export const deleteUserRequest = (
  userId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/company/user/DeleteUser/${userId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getUserByIdRequest = (userId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/user/GetUserById/${userId}`)
    .then((response) => response.data);
};

export const getUsersRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/user/GetUsers')
    .then((response) => response.data);
};

export const getAppVersion = (): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/user/GetAppVersion`)
    .then((response) => response.data);
};
