/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const insertCompanyModuleRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/companyModule/InsertCompanyModule', reqData)
    .then((response) => response.data);
};

export const updateCompanyModuleRequest = (
  moduleId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/companyModule/UpdateCompanyModule/${moduleId}`, reqData)
    .then((response) => response.data);
};

export const deleteCompanyModuleRequest = (
  moduleId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/companyModule/DeleteCompanyModule/${moduleId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getCompanyModuleByIdRequest = (moduleId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/companyModule/GetCompanyModuleById/${moduleId}`)
    .then((response) => response.data);
};

export const getCompanyModulesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/companyModule/GetCompanyModules')
    .then((response) => response.data);
};

export const getCompanyModulesGroupedByParentRequest =
  async (): Promise<any> => {
    return axiosInstance
      .get('/admin/master/companyModule/GetCompanyModulesGroupedByParent')
      .then((response) => response.data);
  };
