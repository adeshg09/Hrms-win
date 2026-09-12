/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const uploadEmployeeDocument = async (
  formData: FormData
): Promise<any> => {
  return axiosInstance.post(
    '/admin/company/employeeDocument/InsertEmployeeDocument',
    formData
  );
};

export const updateEmployeeDocument = async (
  formData: FormData,
  userId: number
): Promise<any> => {
  return axiosInstance.put(
    `/admin/company/employeeDocument/UpdateEmployeeDocument/${userId}`,
    formData
  );
};

export const getEmployeeDocumentDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  // console.log('userId is', userId);
  return axiosInstance
    .get(
      `admin/company/employeeDocument/GetEmployeeDocumentsByUserId/${userId}`
    )
    .then((response) => response.data);
};

export const deleteEmployeeDocumentDetailsByUserId = (
  Id: number
): Promise<any> => {
  return axiosInstance
    .delete(`admin/company/employeeDocument/DeleteEmployeeDocument/${Id}`)
    .then((response) => response.data);
};
