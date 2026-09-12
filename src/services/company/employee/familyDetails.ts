// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';
// import { AddEmployeeFamilyDetailsFormValues } from 'models/company/employee';

// ----------------------------------------------------------------------
export const insertEmployeeFamilyDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeFamilyDetail/InsertAllEmployeeFamilyDetails',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeFamilyDetailRequest = (
  userId: number | null,
  reqData: any
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeFamilyDetail/UpdateEmployeeFamilyDetail/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
export const saveEmployeeFamilyDetailRequest = (reqData: any): Promise<any> => {
  return axiosInstance
    .post(
      `admin/company/employeeFamilyDetail/SaveEmployeeFamilyDetails`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const getEmployeeFamilyDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(
      `admin/company/employeeFamilyDetail/GetEmployeeFamilyDetailsByUserId/${userId}`
    )
    .then((response) => response.data);
};
export const deleteEmployeeFamilyDetailRequest = (id: any): Promise<any> => {
  return axiosInstance
    .delete(
      `admin/company/employeeFamilyDetail/DeleteEmployeeFamilyDetail/${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
