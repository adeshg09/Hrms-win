// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const insertEmployeePersonalDetailRequest = (
  reqData: FormData
): Promise<any> => {
  console.log('reqData is', reqData);
  return axiosInstance
    .post(
      'admin/company/employeePersonalDetail/InsertEmployeePersonalDetail',
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data)
    .catch((e) => console.log('error is', e));
};

export const updateEmployeePersonalDetailRequest = (
  id: number | null | number[] | undefined,
  reqData: FormData
): Promise<any> => {
  console.log('req id is', id);
  return axiosInstance
    .put(
      `admin/company/employeePersonalDetail/UpdateEmployeePersonalDetail/${id}`,
      reqData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => response.data);
};

export const getEmployeePersonalDetailsByUserIdRequest = (
  userId: number | null
): Promise<any> => {
  return axiosInstance
    .get(
      `admin/company/employeePersonalDetail/GetEmployeePersonalDetailByUserId/${userId}`
    )
    .then((response) => response.data);
};
