/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the format date functions.
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
import { format } from 'date-fns';

// ----------------------------------------------------------------------

/**
 * function to format the date
 *
 * @param {Date | string} date - date to convert in specific format
 * @param {string} dateFormat - date format to convert the date
 * @returns {string}
 */
export function getDate(
  date: Date | string,
  dateFormat: string = 'dd MMM yyyy'
): string | undefined {
  if (date) {
    return format(new Date(date), dateFormat);
  }
}

export function formatISODateToYYYYMMDD(isoDate: any): any {
  const date = new Date(isoDate);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
