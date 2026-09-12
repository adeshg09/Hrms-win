/* eslint-disable no-nested-ternary */
/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create data table component.
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
import { memo, useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer
} from '@mui/material';

/* Relative Imports */
import Loader from 'components/Loader';
import ListPagination from 'components/Pagination';
import Scrollbar from 'components/Scrollbar';
import { applySortFilter, getComparator } from 'utility/sortColumn';

/* Local Imports */
import TableHeader from './TableHeader';
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create data table component for showing the data.
 *
 * @interface DataTableProps
 * @property {Array} columns - columns for the data of table
 * @property {Array} rows - rows for the data of table
 * @property {number} totalRow - total row of the data
 * @property {boolean} paging - paging for the data of table
 * @property {number} initialPageSize - initial page size to show on pages of the data table
 * @property {boolean} showResults - show results for the data of table
 * @property {boolean} showRowPerPage - show rows per page for the data of table
 * @property {boolean} isLoading - loading for the data to load
 * @property {object|function} containerStyle - container style for the data table
 */
interface DataTableProps {
  columns: Array<any>;
  rows: Array<any>;
  totalRow: number;
  paging?: boolean;
  initialPageSize?: number;
  showResults?: boolean;
  showRowPerPage?: boolean;
  isLoading?: boolean;
  containerStyle?: object | (() => void);
}

// ----------------------------------------------------------------------

/**
 * Data Table component for showing the data
 *
 * @component
 * @param {Array} columns - columns for the data of table
 * @param {Array} rows - rows for the data of table
 * @param {number} totalRow - total row of the data
 * @param {boolean} paging - paging for the data of table
 * @param {number} initialPageSize - initial page size to show on pages of the data table
 * @param {boolean} showResults - show results for the data of table
 * @param {boolean} showRowPerPage - show rows per page for the data of table
 * @param {boolean} isLoading - loading for the data to load
 * @param {object|function} containerStyle - container style for the data table
 * @returns {JSX.Element}
 */
const DataTable = ({
  columns,
  rows,
  totalRow,
  paging = true,
  initialPageSize = 10,
  showResults = true,
  showRowPerPage = true,
  isLoading = false,
  containerStyle = {}
}: DataTableProps): JSX.Element => {
  /* Constants */
  const rowsPerPageOption = [
    initialPageSize,
    initialPageSize * 2,
    initialPageSize * 5,
    initialPageSize * 10
  ];

  /* States */
  const [filteredRows, setFilteredRows] = useState(rows);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  /* Functions */
  /**
   * @returns {void}
   */
  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  /**
   * @returns {void}
   */
  const handleRowsPerPageChange = (newRowsPerPage: string | number): void => {
    setRowsPerPage(
      typeof newRowsPerPage === 'string'
        ? parseInt(newRowsPerPage, 10)
        : newRowsPerPage
    );
    setPage(1);
  };

  /**
   * @returns {void}
   */
  const handleRequestSort = (property: string): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /* Side-Effects */
  useEffect(() => {
    if (
      page &&
      totalRow > 0 &&
      rowsPerPage &&
      page > Math.ceil(totalRow / rowsPerPage)
    ) {
      setPage(page - 1);
    } /* Types/Interfaces */
    /**
     * Interface used to create table Header component for data table.
     *
     * @interface TableHeaderProps
     * @property {Array} header - header for the data of table header
     * @property {string} order - order for the data of table header
     * @property {string} orderBy - orderBy for the data of table header
     * @property {function} onRequestSort - action for sort of data
     */
  }, [page, rows]);

  useEffect(() => {
    if (rows && order && orderBy) {
      const sortedRows = applySortFilter(rows, getComparator(order, orderBy));
      setFilteredRows(sortedRows);
    } else {
      setFilteredRows(rows || []);
    }
  }, [rows, order, orderBy]);

  /* Output */
  return (
    <Box sx={styles.rootStyle}>
      {isLoading ? (
        <Loader containerStyle={styles.loaderStyle} />
      ) : (
        <>
          <Scrollbar>
            <TableContainer sx={[styles.tableContainer, containerStyle]}>
              <Table>
                <TableHeader
                  header={columns}
                  // rowCount={rows.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredRows && filteredRows.length > 0 ? (
                    <>
                      {filteredRows
                        .slice(
                          (page - 1) * rowsPerPage,
                          (page - 1) * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => {
                          return (
                            <TableRow key={index}>
                              {columns.map((column, cIndex) => (
                                <TableCell
                                  key={cIndex}
                                  align={
                                    column.cellAlign ? column.cellAlign : 'left'
                                  }
                                >
                                  {column.renderCell
                                    ? column.renderCell(row)
                                    : column.getValue
                                    ? column.getValue(row)
                                    : row[column.field]}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <Typography variant="body2" align="left">
                          No results found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          {totalRow > 0 && (
            <ListPagination
              paging={Boolean(paging && totalRow > initialPageSize)}
              currentPage={page}
              itemsPerPage={rowsPerPage}
              itemsPerPageOption={rowsPerPageOption}
              totalItemCount={totalRow}
              showResultTab={showResults}
              showItemsPerPageFilter={showRowPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleRowsPerPageChange}
              containerStyle={styles.pagination}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default memo(DataTable);
