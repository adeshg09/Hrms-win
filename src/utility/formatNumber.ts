/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the heper functions related to format number.
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
import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number: number): string {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}

export function fPercent(number: number): string {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number: number): string {
  return numeral(number).format();
}

export function fShortenNumber(number: number): string {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number: number): string {
  return numeral(number).format('0.0 b');
}
