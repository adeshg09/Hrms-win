/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define helper functions for common.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 16/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

import { appHostName } from 'config/config';

// ----------------------------------------------------------------------

/* Imports */

// ----------------------------------------------------------------------

/**
 * function to get domain name
 *
 * @param {string} domainName - domain name
 * @returns {void}
 */
export const getDomainName = (domainName: string): string => {
  domainName = domainName.toLowerCase();
  const splitDomainName = domainName.split('');
  const mapDominName = splitDomainName.map(function (item: any) {
    /* eslint-disable no-nested-ternary */
    return item === '-' ? '_' : item && item === ' ' ? '_' : item;
  });
  /* eslint-disable no-useless-escape */
  const domainNameUpdated = mapDominName
    .join('')
    .replace(/[~`!@#$%^&*()+={}\[\];:'"<>.,\/\\\?]/g, '');
  return domainNameUpdated;
};

export const getCompanyDomainFromHostname = (
  hostname: string
): string | undefined => {
  // console.log('url', url);
  // console.log(url.split('.'));
  // const regexParse = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
  // const urlParts = regexParse.exec(url);
  // const urlParts = url.match('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
  // console.log(
  //   '=----urlp--',
  //   url.replace(urlParts?.length ? urlParts[0] : '', '').slice(0, -1)
  // );

  // const result: any = {};
  // const urlParts = window.location.hostname.match(
  //   '([a-z-0-9]{2,63}).([a-z.]{2,5})$'
  // );
  // if (urlParts?.length) {
  //   result.domain = urlParts[1];
  //   result.type = urlParts[2];
  //   result.subdomain = window.location.hostname
  //     .replace(result.domain + '.' + result.type, '')
  //     .slice(0, -1);
  // }
  // console.log('...resit', result);

  // const split = hostname.split('.');
  // let subdomain = '';
  // let domain = '';
  // if (split.length === 1) {
  //   // localHost
  //   domain = split.at(0) || '';
  // } else if (split.length === 2) {
  //   // sub.localHost or example.com
  //   if (split[1].includes('localhost')) {
  //     // sub.localHost
  //     domain = split.at(1) || '';
  //     subdomain = split.at(0) || '';
  //   } else {
  //     // example.com
  //     domain = split.join('.');
  //   }
  // } else {
  //   // sub2.sub.localHost or sub2.sub.example.com or sub.example.com or example.com.ec sub.example.com.ec or  ... etc
  //   const last = split[split.length - 1];
  //   const lastLast = split[split.length - 2];
  //   if (last.includes('localhost')) {
  //     // sub2.sub.localHost
  //     domain = last;
  //     subdomain = split.slice(0, split.length - 1).join('.');
  //   } else if (last.length === 2 && lastLast.length <= 3) {
  //     // example.com.ec or sub.example.com.ec
  //     domain = split.slice(split.length - 3, split.length).join('.');
  //     if (split.length > 3) {
  //       // sub.example.com.ec
  //       subdomain = split.slice(0, split.length - 3).join('.');
  //     }
  //   } else {
  //     // sub2.sub.example.com
  //     domain = split.slice(split.length - 2, split.length).join('.');
  //     subdomain = split.slice(0, split.length - 2).join('.');
  //   }
  // }
  // console.log('=====3[=', domain, subdomain);
  // return subdomain;

  if (hostname !== appHostName) {
    const split = hostname.split(appHostName || '');
    let subdomain = split[0];
    if (subdomain) {
      subdomain = subdomain.substring(0, subdomain.length - 1);
    }
    return subdomain;
  }

  return '';
};
