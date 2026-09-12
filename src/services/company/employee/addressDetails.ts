// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------
export const insertEmployeeAddressDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post('admin/company/employeeAddress/InsertAllEmployeeAddresses', reqData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.data);
};

export const updateEmployeeAddressDetailRequest = (
  id: number | null,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeAddress/InsertAllEmployeeAddresses/${id}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const deleteEmployeeAddressDetailRequest = (
  id: number | null
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/company/employeeAddress/DeleteEmployeeAddress/${id}`)
    .then((response) => response.data);
};
export const saveEmployeeAddressDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post(`admin/company/employeeAddress/SaveEmployeeAddresses`, reqData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.data);
};

export const getEmployeeAddressDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(`admin/company/employeeAddress/GetEmployeeAddressesByUserId/${userId}`)
    .then((response) => response.data);
};
