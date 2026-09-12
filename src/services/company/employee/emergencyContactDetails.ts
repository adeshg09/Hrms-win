// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

interface EmergencyContact {
  contactName: string;
  contactAddress: string;
  contactRelation: string;
  phone: string;
  userId: number | null;
}

export const insertEmployeeEmergencyContactDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post(
      'admin/company/employeeEmergencyContact/InsertAllEmployeeEmergencyContacts',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const updateEmployeeEmergencyContactDetailRequest = (
  userId: number | null,
  reqData: EmergencyContact[]
): Promise<any> => {
  return axiosInstance
    .put(
      `admin/company/employeeEmergencyContact/UpdateEmployeeEmergencyContact/${userId}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};
export const saveEmployeeEmergencyContactDetailRequest = (
  reqData: any
): Promise<any> => {
  return axiosInstance
    .post(
      `admin/company/employeeEmergencyContact/SaveEmployeeEmergencyContacts`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const getEmployeeEmergencyContactDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(
      `admin/company/employeeEmergencyContact/GetEmployeeEmergencyContactsByUserId/${userId}`
    )
    .then((response) => response.data);
};

export const deleteEmployeeEmergencyContactDetailsByUserId = (
  Id: number
): Promise<any> => {
  return axiosInstance
    .delete(
      `admin/company/employeeEmergencyContact/DeleteEmployeeEmergencyContact/${Id}`
    )
    .then((response) => response.data);
};
