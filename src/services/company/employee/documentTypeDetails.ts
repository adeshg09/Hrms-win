/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const getDocumentType = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/employeeDocumentType/GetEmployeeDocumentTypes')
    .then((response) => response.data);
};
