// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeEducationalDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeEducationalDetail/InsertAllEmployeeEducationalDetails',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeEducationalDetailRequest = (
  userId: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeEducationalDetail/UpdateEmployeeEducationalDetail/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
export const saveEmployeeEducationDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post(
      `admin/company/employeeEducationalDetail/SaveEmployeeEducationalDetails`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const getEmployeeEducationDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(
      `admin/company/employeeEducationalDetail/GetEmployeeEducationalDetailsByUserId/${userId}`
    )
    .then((response) => response.data);
};

export const deleteEmployeeEducationDetailsById = (
  Id: number
): Promise<any> => {
  return axiosInstance
    .delete(
      `admin/company/employeeEducationalDetail/DeleteEmployeeEducationalDetail/${Id}`
    )
    .then((response) => response.data);
};
