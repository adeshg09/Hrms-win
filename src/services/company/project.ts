/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to project.
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

export const insertProjectRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/company/project/InsertProject', reqData)
    .then((response) => response.data);
};

export const updateProjectRequest = (
  projectId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/project/UpdateProject/${projectId}`, reqData)
    .then((response) => response.data);
};

export const updateProjectStatusRequest = (
  projectId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/company/project/UpdateProjectStatus/${projectId}`, reqData)
    .then((response) => response.data);
};

export const deleteProjectRequest = (
  projectId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/company/project/DeleteProject/${projectId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getProjectByIdRequest = (projectId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/project/GetProjectById/${projectId}`)
    .then((response) => response.data);
};

export const getProjectRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/project/GetProjects')
    .then((response) => response.data);
};

export const getProjectsByUserIdRequest = (userId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/project/GetProjectsByUserId/${userId}`)
    .then((response) => response.data);
};

export const getProjectListByUserIdRequest = (userId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/company/project/GetProjectListByUserId/${userId}`)
    .then((response) => response.data);
};
