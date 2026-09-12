/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to auth.
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

export const loginUserRequest = (
  email: string,
  password: string,
  rememberMe: boolean | number
): Promise<any> => {
  return axiosInstance
    .post('/auth/LoginUser', {
      email,
      password,
      rememberMe
    })
    .then((response) => response.data);
};

export const forgotPasswordRequest = (
  email: string,
  resetPasswordUrl: string
): Promise<any> => {
  return axiosInstance
    .post('/auth/ForgotPassword', {
      email,
      resetPasswordUrl
    })
    .then((response) => response.data);
};

export const resetPasswordRequest = (
  token: string,
  newPassword: string
): Promise<any> => {
  return axiosInstance
    .post('/auth/ResetPassword', {
      token,
      newPassword
    })
    .then((response) => response.data);
};
