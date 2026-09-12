/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define helper functions for authentication.
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
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

// ----------------------------------------------------------------------

/* Constants */
const cookieKey = 'hrms_token';
// const companyCookieKey = 'te_tracker_company_token';

// ----------------------------------------------------------------------

/**
 * function to set access token in cookies
 *
 * @param {string} accessToken - logged in user token
 * @param {boolean} isRememberMe - flag to remember/forgot user after session ends.
 * @returns {void}
 */
export const setAccessToken = (
  accessToken: string,
  isRememberMe: boolean
): void => {
  const cookieConfig: any = {
    path: '/',
    sameSite: true
  };
  const expiresDate = new Date(); // Now
  if (isRememberMe) {
    expiresDate.setDate(expiresDate.getDate() + 30); // Set now + 30 days as the new date

    cookieConfig.expires = expiresDate;
  } else {
    expiresDate.setDate(expiresDate.getDate() + 1); // Set now + 1 days as the new date
    cookieConfig.expires = expiresDate;
  }
  Cookies.set(cookieKey, accessToken, cookieConfig);
};

/**
 * function to remove access token from cookies
 *
 * @returns {void}
 */
export const removeAccessToken = (): void => {
  const cookieConfig: any = {
    path: '/',
    sameSite: true,
    expires: 0
  };
  Cookies.remove(cookieKey, cookieConfig);
};

/**
 * function to get access token from cookies
 *
 * @returns {string} - returns a access token from cookies
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(cookieKey);
};

/**
 * function to validate the access toke by decoding the jwt token
 * @param {string} accessToken - logged in user token
 *
 * @returns {string} - returns a access token from cookies
 */
export const isValidToken = (accessToken: string): string | undefined => {
  if (!accessToken) {
    return;
  }
  const decoded: any = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime ? decoded : undefined;
};

// /**
//  * function to set company in cookies
//  *
//  * @param {string} companyName - logged in company
//  * @param {boolean} isRememberMe - flag to remember/forgot user after session ends.
//  * @returns {void}
//  */
// export const setCompany = (
//   companyName: string,
//   isRememberMe: boolean
// ): void => {
//   const cookieConfig: any = {
//     path: '/',
//     sameSite: true
//   };
//   const expiresDate = new Date(); // Now
//   if (isRememberMe) {
//     expiresDate.setDate(expiresDate.getDate() + 30); // Set now + 30 days as the new date

//     cookieConfig.expires = expiresDate;
//   } else {
//     expiresDate.setDate(expiresDate.getDate() + 1); // Set now + 1 days as the new date
//     cookieConfig.expires = expiresDate;
//   }
//   Cookies.set(companyCookieKey, companyName, cookieConfig);
// };

// /**
//  * function to remove company from cookies
//  *
//  * @returns {void}
//  */
// export const removeCompany = (): void => {
//   const cookieConfig: any = {
//     path: '/',
//     sameSite: true,
//     expires: 0
//   };
//   Cookies.remove(companyCookieKey, cookieConfig);
// };

// /**
//  * function to get company from cookies
//  *
//  * @returns {string} - returns a company from cookies
//  */
// export const getCompany = (): string | undefined => {
//   return Cookies.get(companyCookieKey);
// };
