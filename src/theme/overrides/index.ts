/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description ComponentsOverrides holds all imported components
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created  : 02/Aug/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { Theme } from '@mui/material';
import { merge } from 'lodash';

/* Local Imports */
import Accordion from './Accordion';
import AutoComplete from './Autocomplete';
import Avatar from './Avatar';
import Backdrop from './Backdrop';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import Chip from './Chip';
import ControlLabel from './ControlLabel';
import Dialog from './Dialog';
import Drawer from './Drawer';
import Fab from './Fab';
import IconButton from './IconButton';
import Input from './Input';
import Lists from './Lists';
import LoadingButton from './LoadingButton';
import Menu from './Menu';
import Pagination from './Pagination';
import Paper from './Paper';
import Pickers from './Pickers';
import Popover from './Popover';
import Radio from './Radio';
import Select from './Select';
import Switch from './Switch';
import Table from './Table';
import Tabs from './Tabs';
import Typography from './Typography';

// ----------------------------------------------------------------------

/**
 * Allows all imported components to use theme by passing as props, merging and making into single component.
 * @component
 * @param theme - passed as props to the imported components
 * @returns single component containing all imported components
 */
export default function ComponentsOverrides(theme: Theme): any {
  /* Output */
  return merge(
    Accordion(theme),
    AutoComplete(theme),
    Avatar(theme),
    Backdrop(theme),
    Button(theme),
    Card(theme),
    Checkbox(theme),
    Chip(theme),
    ControlLabel(theme),
    Dialog(theme),
    Drawer(theme),
    Fab(theme),
    IconButton(),
    Input(theme),
    Lists(theme),
    LoadingButton(),
    Menu(theme),
    Pagination(theme),
    Paper(),
    Pickers(theme),
    Popover(theme),
    Radio(theme),
    Select(),
    Switch(theme),
    Table(theme),
    Tabs(theme),
    Typography(theme)
  );
}
