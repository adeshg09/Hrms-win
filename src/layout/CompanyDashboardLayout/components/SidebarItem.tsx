/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create single item for side bar.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create side bar item to show as tab.
 *
 * @interface SidebarItemProps
 * @property {object} icon - icon to show for list item
 * @property {string} title - name of the tab in side bar
 * @property {string} href - redirect url of the tab in side bar
 */
export interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  href: string;
}

// ----------------------------------------------------------------------

/**
 * Side bar item to show as tab.
 *
 * @component
 * @param {object} icon - icon to show for list item
 * @param {string} title - name of the tab in side bar
 * @param {string} href - redirect url of the tab in side bar
 * @returns {JSX.Element}
 */
const SidebarItem = ({
  icon: Icon,
  title,
  href,
  ...other
}: SidebarItemProps): JSX.Element => {
  /* Hooks */
  const { pathname } = useLocation();
  const navigate = useNavigate();

  /* Output */
  return (
    <ListItemButton
      selected={Boolean(href && pathname.includes(href))}
      onClick={() => navigate(href)}
      {...other}
    >
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: 'body2'
        }}
      />
    </ListItemButton>
  );
};

export default memo(SidebarItem);
