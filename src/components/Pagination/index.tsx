/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create pagination component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 18/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import React, { memo } from 'react';
import { Box, MenuItem, Pagination, Select, Typography } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Pagination Component for list.
 *
 * @interface ListPaginationProps
 * @property {boolean} paging - flag to enable/disable paging
 * @property {number} currentPage - page number of current page
 * @property {number} itemsPerPage - number of items listed in a page
 * @property {array} itemsPerPageOption - array for select box of items per page
 * @property {number} totalItemCount - total number of items
 * @property {function} onPageChange - changing page number on clicking
 * @property {function} onItemsPerPageChange - selecting number of Items to list in a page
 * @property {boolean} showResultTab - condition whether to show ResultTab
 * @property {boolean} showItemsPerPageFilter - condition whether to use ItemsPerPage selection tab
 * @property {object|function} containerStyle - custom styles
 */
export interface ListPaginationProps {
  paging: boolean;
  currentPage: number;
  itemsPerPage: number;
  itemsPerPageOption: Array<any>;
  totalItemCount: number;
  onPageChange: (val: number) => void;
  onItemsPerPageChange?: (val: string | number) => void;
  showResultTab?: boolean;
  showItemsPerPageFilter?: boolean;
  containerStyle?: object | (() => void);
}

// ----------------------------------------------------------------------

/**
 * Pagination Component for list.
 *
 * @component
 * @param {boolean} paging - flag to enable/disable paging
 * @param {number} currentPage - page number of current page
 * @param {number} itemsPerPage - number of items listed in a page
 * @param {array} itemsPerPageOption - array for select box of items per page
 * @param {number} totalItemCount - total number of items
 * @param {function} onPageChange - changing page number on clicking
 * @param {function} onItemsPerPageChange - selecting number of Items to list in a page
 * @param {boolean} showResultTab - condition whether to show ResultTab
 * @param {boolean} showItemsPerPageFilter - condition whether to use ItemsPerPage selection tab
 * @param {object|function} containerStyle - custom styles
 */
const ListPagination = ({
  paging,
  currentPage,
  itemsPerPage,
  itemsPerPageOption,
  totalItemCount,
  onPageChange,
  onItemsPerPageChange = () => null,
  showResultTab = true,
  showItemsPerPageFilter = true,
  containerStyle = {}
}: ListPaginationProps): JSX.Element => {
  /* Constants */
  const firstItemCount = (currentPage - 1) * itemsPerPage + 1;
  const lastItemCount =
    (currentPage - 1) * itemsPerPage + itemsPerPage > totalItemCount
      ? totalItemCount
      : (currentPage - 1) * itemsPerPage + itemsPerPage;

  /* Output */
  return (
    <Box sx={[styles.rootStyle, containerStyle]}>
      <Box
        sx={[
          styles.paginationOptions,
          !paging && { justifyContent: 'flex-end' }
        ]}
      >
        {showResultTab && (
          <Typography variant="caption">
            Records :{' '}
            {`${firstItemCount} - ${lastItemCount} of ${totalItemCount}`}
          </Typography>
        )}
        {paging && showItemsPerPageFilter && (
          <Select
            variant="outlined"
            size="small"
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(e.target.value);
            }}
            sx={styles.selectStyle}
          >
            {itemsPerPageOption.map((option: any) => (
              <MenuItem key={option} value={option}>
                {`${option} / page`}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>
      {paging && (
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          data-testid="paginationComp"
          page={currentPage}
          siblingCount={0}
          boundaryCount={1}
          count={Math.ceil(totalItemCount / itemsPerPage)}
          onChange={(_, page) => onPageChange(page)}
          sx={styles.pagination}
        />
      )}
    </Box>
  );
};

export default memo(ListPagination);
