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
import React, { memo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

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
  dropdownIcon?: React.ElementType;
  subItems?: Array<{ title: string; href: string; icon: React.ElementType }>;
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
  subItems,
  ...other
}: SidebarItemProps): JSX.Element => {
  /* Hooks */
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => {
    // Initialize open state based on current path
    return subItems
      ? subItems.some((item) => pathname.includes(item.href))
      : false;
  });

  const isSelected =
    href === pathname ||
    (subItems && subItems.some((item) => pathname.includes(item.href)));

  const handleMainClick = (): void => {
    // Navigate to the profile route when the main item is clicked
    navigate(href);
  };

  const handleDropdownClick = (e: React.MouseEvent): void => {
    e.stopPropagation(); // Prevent the click event from triggering handleMainClick
    setOpen(!open); // Toggle the dropdown for subitems
  };

  /* Output */
  return (
    <>
      <ListItemButton
        selected={isSelected}
        onClick={handleMainClick}
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
        {subItems && (
          <ListItemIcon onClick={handleDropdownClick}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
        )}
      </ListItemButton>
      {subItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItems.map((item, index) => (
              <ListItemButton
                key={index}
                selected={Boolean(item.href && pathname.includes(item.href))}
                onClick={() => navigate(item.href)}
                sx={{ ml: 2 }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    variant: 'body2'
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default memo(SidebarItem);
