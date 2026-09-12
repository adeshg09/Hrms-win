/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the sort column functions.
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

/**
 * function to compare the data for sorting
 *
 * @param {object} a - single item of data array
 * @param {object} b - single item of data array
 * @param {string} orderBy - column name to check the data
 * @returns {number}
 */
export function descendingComparator(a: any, b: any, orderBy: string): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * function to get comparator based on order
 *
 * @param {string} order - sort order of column
 * @param {string} orderBy - column name to sort the data
 * @returns {function}
 */
export function getComparator(order: string, orderBy: string): any {
  return order === 'desc'
    ? (a: object, b: object) => descendingComparator(a, b, orderBy)
    : (a: object, b: object) => -descendingComparator(a, b, orderBy);
}

/**
 * function to sort the data
 *
 * @param {array} array - data to perform the sort action
 * @param {function} comparator - function to compare the items
 * @returns {array}
 */
export function applySortFilter(
  array: Array<any>,
  comparator: (val1: Array<any>, val2: Array<any>) => number
): Array<any> {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
