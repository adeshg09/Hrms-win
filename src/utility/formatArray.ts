/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the format array functions.
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
 * function to remove item from array
 *
 * @param {array} itemArray - array of items to remove item
 * @param {string} match - object property to match with id
 * @param {number} id - item's id to find the index
 * @returns {array}
 */
export function removeItemFromArray(
  itemArray: Array<any>,
  match: string,
  id: number
): Array<any> {
  const index = itemArray?.findIndex((x) => x[match] === id);
  if (index > -1) {
    itemArray.splice(index, 1);
  }
  return itemArray;
}

/**
 * function to update item from array
 *
 * @param {array} itemArray - array of items to update item
 * @param {string} match - object property to match with id
 * @param {number} id - item's id to find the index
 * @param {string} fieldMatch - object property to match with field
 * @param {any} value - object property to update with value
 * @returns {array}
 */
export function updateItemFromArray(
  itemArray: Array<any>,
  match: string,
  id: number,
  fieldMatch: string,
  value: any
): Array<any> {
  itemArray?.map((item) => {
    if (item[match] === id) {
      item[fieldMatch] = value;
    }
    return item;
  });
  return itemArray;
}

/**
 * function to update nested item from array
 *
 * @param {object} obj - item to update
 * @param {string} path - object property to match with id
 * @param {any} value - object property to update with value
 * @returns {void}
 */
function setNestedProperty(obj: any, path: string, value: any): void {
  const fields = path.split('.'); // Split the string into individual fields
  let current = obj;

  // Traverse the object up to the second-to-last field
  for (let i = 0; i < fields.length - 1; i++) {
    if (!current[fields[i]]) return; // If any level is undefined, exit
    current = current[fields[i]];
  }

  // Set the value at the final field
  current[fields[fields.length - 1]] = value;
}

/**
 * function to update nested item from array
 *
 * @param {array} itemArray - array of items to update item
 * @param {string} match - object property to match with id
 * @param {number} id - item's id to find the index
 * @param {string} fieldMatch - object property to match with field
 * @param {any} value - object property to update with value
 * @returns {array}
 */
export function updateNestedItemFromArray(
  itemArray: Array<any>,
  match: string,
  id: number,
  fieldMatch: string,
  value: any
): Array<any> {
  itemArray?.map((item) => {
    if (item[match] === id) {
      setNestedProperty(item, fieldMatch, value); // Dynamically update the nested field
    }
    return item;
  });
  return itemArray;
}
