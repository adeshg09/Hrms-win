/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to company.
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

export const insertCompanyRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/company/InsertCompany', reqData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => response.data);
};

export const updateCompanyRequest = (
  companyId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/company/UpdateCompany/${companyId}`, reqData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => response.data);
};

export const updateCompanyStatusRequest = (
  companyId: number,
  reqData: FormData
): Promise<any> => {
  return axiosInstance
    .put(`/admin/master/company/UpdateCompanyStatus/${companyId}`, reqData)
    .then((response) => response.data);
};

export const deleteCompanyRequest = (
  companyId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/company/DeleteCompany/${companyId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getCompanyByIdRequest = (companyId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/company/GetCompanyById/${companyId}`)
    .then((response) => response.data);
};

export const getCompaniesRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/company/GetCompanies')
    .then((response) => response.data);
};
