// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeExperienceDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeExperienceDetail/InsertAllEmployeeExperienceDetails',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeExperienceDetailRequest = (
  userId: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeExperienceDetail/UpdateEmployeeExperienceDetail/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
export const SaveEmployeeExperienceDetails = (reqData: any): Promise<any> => {
  return axiosInstance
    .post(
      `admin/company/employeeExperienceDetail/SaveEmployeeExperienceDetails`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const getEmployeeExperienceDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(
      `admin/company/employeeExperienceDetail/GetEmployeeExperienceDetailsByUserId/${userId}`
    )
    .then((response) => response.data);
};

export const deleteEmployeeExperienceDetailsById = (
  Id: number
): Promise<any> => {
  return axiosInstance
    .delete(
      `admin/company/employeeExperienceDetail/DeleteEmployeeExperienceDetail/${Id}`
    )
    .then((response) => response.data);
};
