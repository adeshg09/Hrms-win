/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to project for user module.
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

export const getProjectsRequest = (reqData: any): Promise<any> => {
  return axiosInstance
    .post('/user/company/project/GetUserProjectsUserModule', reqData)
    .then((response) => response.data);
};

export const getUserLeaderProjectsRequest = (reqData: any): Promise<any> => {
  return axiosInstance
    .post('/user/company/project/GetUserLeaderProjectsUserModule', reqData)
    .then((response) => response.data);
};
