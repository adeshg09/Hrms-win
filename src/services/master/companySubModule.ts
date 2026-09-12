/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const insertCompanySubModuleRequest = (
  reqData: FormData
): Promise<any> => {
  console.log('req data is', reqData);
  return axiosInstance
    .post('/admin/master/companySubModule/InsertCompanySubModule', reqData)
    .then((response) => response.data);
};

export const updateCompanySubModuleRequest = (
  subModuleId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(
      `/admin/master/companySubModule/UpdateCompanySubModule/${subModuleId}`,
      reqData
    )
    .then((response) => response.data);
};

export const deleteCompanySubModuleRequest = (
  subModuleId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(
      `/admin/master/companySubModule/DeleteCompanySubModule/${subModuleId}`,
      {
        data: {
          modifiedBy
        }
      }
    )
    .then((response) => response.data);
};

export const getCompanySubModuleByIdRequest = (
  subModuleId: number
): Promise<any> => {
  return axiosInstance
    .get(
      `/admin/master/companySubModule/GetCompanySubModuleById/${subModuleId}`
    )
    .then((response) => response.data);
};

export const getCompanySubModulesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/companySubModule/GetCompanySubModules')
    .then((response) => response.data);
};

export const getCompanyProfileSubModulesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/company/role/GetCompanyProfileSubModules')
    .then((response) => response.data);
};
