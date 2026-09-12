/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to account.
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

export const getProfileRequest = (token: string): Promise<any> => {
  return axiosInstance
    .get('/account/GetProfile', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.data);
};

export const changePasswordRequest = (
  userId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/account/ChangePassword/${userId}`, reqData)
    .then((response) => response.data);
};

export const changeProfilePhotoRequest = (
  userId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/account/ChangeUserProfilePhoto/${userId}`, reqData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => response.data);
};
export const changeProfilePhotoRequestv1 = (
  userId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/account/ChangeProfilePhoto/${userId}`, reqData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => response.data);
};
