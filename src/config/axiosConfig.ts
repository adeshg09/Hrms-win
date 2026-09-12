/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the configrations for axios.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 16/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import axios from 'axios';

/* Relative Imports */
import { getAccessToken } from 'helper/authHelper';

/* Local Imports */
import { apiBaseUrl } from './config';

// ----------------------------------------------------------------------

const axiosConfig = axios.create({
  baseURL: apiBaseUrl
});

axiosConfig.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) config.headers.authorization = `bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosConfig;
