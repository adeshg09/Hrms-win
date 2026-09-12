/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to company for user module.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const getCompanyByIdRequest = (companyId: number): Promise<any> => {
  return axiosInstance
    .get(`/user/master/company/GetCompanyByIdUserModule/${companyId}`)
    .then((response) => response.data);
};

export const getCompaniesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/user/master/company/GetCompaniesUserModule')
    .then((response) => response.data);
};

export const getCompanyDetailsRequest = (companyDomain: any): Promise<any> => {
  return axiosInstance
    .get(
      `/user/master/company/GetCompanyByDomainNameUserModule/${companyDomain}`
    )
    .then((response) => response.data)
    .catch((err) => console.log(JSON.stringify({ error: err.message })));
};

export const registerCompanyRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/user/master/company/RegisterCompany', reqData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => response.data);
};
