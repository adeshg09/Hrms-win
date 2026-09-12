/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create data table's header component.
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
import { memo } from 'react';
import { TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create table Header component for data table.
 *
 * @interface TableHeaderProps
 * @property {Array} header - header for the data of table header
 * @property {string} order - order ('asc' | 'desc') for the data of table header
 * @property {string} orderBy - orderBy for the data of table header
 * @property {function} onRequestSort - action for sort of data
 */
export interface TableHeaderProps {
  header: Array<any>;
  order: any;
  orderBy?: any;
  onRequestSort: (field: string) => void;
}

// ----------------------------------------------------------------------

/**
 * Table Header component for data table
 *
 * @component
 * @param {Array} header - header for the data of table header
 * @param {string} order - order for the data of table header
 * @param {string} orderBy - orderBy for the data of table header
 * @param {function} onRequestSort - action for sort of data
 * @returns {JSX.Element}
 */
const TableHeader = ({
  header,
  order,
  orderBy = '',
  onRequestSort
}: TableHeaderProps): JSX.Element => {
  /* Output */
  return (
    <TableHead>
      <TableRow>
        {header.map((headCell) => (
          <TableCell
            key={headCell.field}
            align={headCell.headerAlign ? headCell.headerAlign : 'left'}
            width={headCell.width ? headCell.width : undefined}
            sortDirection={orderBy === headCell.field ? order : false}
            sx={{
              ...(headCell.minWidth && { minWidth: headCell.minWidth }),
              ...(headCell.flex && { flex: headCell.flex })
            }}
          >
            {headCell.headerName ? (
              <>
                {!headCell.sortable ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column'
                    }}
                  >
                    {headCell.headerName}
                  </span>
                ) : (
                  <TableSortLabel
                    active={orderBy === headCell.field}
                    direction={orderBy === headCell.field ? order : 'asc'}
                    onClick={() => {
                      if (onRequestSort) {
                        onRequestSort(headCell.field);
                      }
                    }}
                    sx={styles.headerNameStyle}
                  >
                    {headCell.headerName}
                  </TableSortLabel>
                )}
              </>
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default memo(TableHeader);
