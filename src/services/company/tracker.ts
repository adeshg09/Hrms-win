/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to tracker.
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

export const getEmployeeProjectWorkedDates = (
  userId: string,
  projectId: string
): Promise<any> => {
  return axiosInstance
    .post('/admin/company/tracker/GetUserProjectWorkedDates', {
      userId,
      projectId
    })
    .then((response) => response.data);
};

export const getTracksByProjectIDEmployeeIDDate = (
  projectId: string,
  userId: string,
  date: string
): Promise<any> => {
  return axiosInstance
    .post('/admin/company/tracker/GetTrackingByProjectIdAndUserId', {
      projectId,
      userId,
      date
    })
    .then((response) => response.data);
};

export const GetTrackingsRequest = (
  userId: number | null,
  projectId: number | null,
  date: string
): Promise<any> => {
  return axiosInstance
    .post('/admin/company/tracker/GetTrackings', {
      userId,
      projectId,
      date
    })
    .then((response) => response.data);
};

export const getInstallerFile = (
  osType: string,
  companyName: string
): Promise<any> => {
  return axiosInstance
    .get(
      `/admin/company/trackerDetail/GetInstallerFile/${osType}/${companyName}`
    )
    .then((response) => response.data);
};
