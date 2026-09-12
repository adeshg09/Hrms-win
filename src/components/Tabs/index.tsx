/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Accordian component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 28/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import React, { useState } from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
/* Local Imports */
import styles from './index.style';

interface TabProp {
  label: string;
  component?: React.ReactNode;
}
interface TabsProp {
  tabs: TabProp[];
  setActiveStep: any;
}

const CustomTabs = ({ tabs, setActiveStep }: TabsProp): JSX.Element => {
  const [value, setValue] = useState('1');

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: string
  ): void => {
    setValue(newValue);
    setActiveStep(parseInt(newValue, 10)); // Use newValue instead of value
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            textColor="primary"
            indicatorColor="secondary"
            sx={styles.tabs}
          >
            {tabs.map((label, i) => (
              <Tab label={label.label} value={(i + 1).toString()} key={i} />
            ))}
          </TabList>
        </Box>
        {tabs.map((components, i) => (
          <TabPanel value={value} key={i}>
            {components.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};
export default CustomTabs;
