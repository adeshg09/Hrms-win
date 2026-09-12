/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Manage Leave Request Page to handle the Leaves.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 18/Jan/2024
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------
/* Local Imports */

import { Box, Button, Divider, Grid, TextField } from '@mui/material';
import DataTable from 'components/DataTable';
import { AdminDashboardPage } from 'components/Page';
import { useContext, useEffect, useState } from 'react';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import { CustomField, TextInput } from 'components/InputFields';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CustomTabs from 'components/Tabs';
import CustomFormDailog from 'components/Dialog/CustomFormDailog';
import { LeaveRequestDraft } from 'models/company/LeaveRequest';
import {
  getAllLeaveRequest,
  updateLeaveRequest
} from 'services/company/leaveRequest';
import SessionContext from 'context/SessionContext';
import { AppliedLeaveData, LeaveRequestType } from 'models/company/ApplyLeave';
import { LoadingButton } from '@mui/lab';
import UploadSingleFile from 'components/InputFields/upload/UploadSingleFile';
import adminStyle from '../../company.style';
/* Relative Imports */
/**
 * Component to create the Leave Requesr listing with accept/Reject actions.
 *
 * @component
 * @returns {JSX.Element}
 */

const ManageLeaveRequest = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();
  const { user } = useContext(SessionContext);
  /* States */
  const [rows, setRows] = useState<AppliedLeaveData[]>([]);
  const [originalData, setOriginalData] = useState<AppliedLeaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFormDailog, setOpenFormDailog] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<LeaveRequestDraft>({
    id: null,
    name: '',
    leaveName: '',
    leave_type_id: null,
    from_date: '',
    to_date: '',
    document: null,
    reason: '',
    remark: null,
    status: 'pending'
  });
  const [sortedData, setSortedData] = useState<AppliedLeaveData[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [filters, setFilters] = useState({
    searchText: ''
  });
  const [isAcceptSubmitting, setIsAcceptSubmitting] = useState(false);
  const [isRejectSubmitting, setIsRejectSubmitting] = useState(false);

  /* Function to get leave Request data */
  const getLeaveRequest = async (): Promise<void> => {
    try {
      // const response: any = await new Promise((resolve) => {
      //   setTimeout(() => resolve(LeaveRequestData), 1000);
      // });
      const response = await getAllLeaveRequest();
      if (response.status.response_code === 200) {
        setRows(response.leaveRequests);
        setOriginalData(response.leaveRequests);
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /* Function to handle Leave request-Including Partial Request
   * @params {leaveRequestId} : id of the leave request
   * @return {void}
   */
  const handleLeaveOpenDailog = (leaveRequestId: number): void => {
    try {
      const rowData = rows.find((row) => row.id === leaveRequestId);
      if (rowData) {
        setOpenFormDailog(true);
        setInitialValues({
          id: rowData.id,
          leaveName: rowData.leaveType.name,
          name: rowData.user.first_name,
          leave_type_id: rowData.leave_type_id,
          to_date: rowData.to_date,
          from_date: rowData.from_date,
          reason: rowData.reason,
          status: rowData.status,
          document: rowData.document,
          remark: rowData.remark
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* Function to handle Leave Reject
   * @params {leaveRequestId} : id of the leave request
   * @return {void}
   */

  const handleReject = async (leaveRequestId: number): Promise<void> => {
    setIsRejectSubmitting(true);
    try {
      const requestData = {
        status: 'rejected',
        remark: initialValues.remark,
        modifiedBy: user.id
      };
      const response = await updateLeaveRequest(leaveRequestId, requestData);
      setOpenFormDailog(false);
      if (response.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.leaveRejected,
          'success'
        );
        await getLeaveRequest();
      } else if (response.status.response_code === 400) {
        showSnackbar(response.error || toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setIsRejectSubmitting(false);
  };
  /* Function to handle Leave Accept
   * @params {leaveRequestId} : id of the leave request
   * @return {void}
   */
  /**
   * function to handle the filters
   *
   * @returns {void}
   */
  const handleFilterChange = async (): Promise<void> => {
    let updatedRows = originalData;

    if (filters.searchText) {
      updatedRows = updatedRows.filter(
        (item) =>
          item.user.first_name
            .toLowerCase()
            .indexOf(filters.searchText.toLowerCase()) > -1
      );
    }

    setRows(updatedRows);
  };
  const handleLeaveAccept = async (leaveRequestId: number): Promise<void> => {
    setIsAcceptSubmitting(true);
    try {
      const requestData: any = {
        status: 'approved',
        modifiedBy: user.id
      };
      const response = await updateLeaveRequest(leaveRequestId, requestData);
      setOpenFormDailog(false);
      if (response.status.response_code === 200) {
        showSnackbar(
          toastMessages.success.adminDashboard.leaveAccepted,
          'success'
        );
        await getLeaveRequest();
      } else if (response.status.response_code === 400) {
        showSnackbar(response.error || toastMessages.error.common, 'error');
      }
    } catch (error) {
      console.log(error);
      showSnackbar(toastMessages.error.common, 'error');
    }
    setIsAcceptSubmitting(false);
  };
  /* columns */
  const columns = [
    {
      field: 'user.firstName',
      headerName: 'Name',
      sortable: true,
      width: 160,
      getValue: (params: AppliedLeaveData) =>
        `${params.user.first_name} ${params.user.last_name}`
    },
    {
      field: 'from_date',
      headerName: 'From Date',
      sortable: true,
      width: 140
    },
    {
      field: 'to_date',
      headerName: 'Till Date',
      sortable: true,
      width: 140
    },
    // {
    //   field: 'noOfDays',
    //   headerName: 'Days',
    //   sortable: true,
    //   width: 120
    // },
    {
      field: 'reason',
      headerName: 'Reason',
      sortable: true,
      width: 230
    },
    {
      field: 'action',
      headerName: 'Actions',
      cellAlign: 'center',
      headerAlign: 'center',
      width: 120,
      renderCell: (params: LeaveRequestType) => (
        <Box sx={adminStyle.actionItems}>
          <Button
            onClick={() => {
              if (params.id) {
                handleLeaveOpenDailog(params.id);
              }
            }}
          >
            <RemoveRedEyeOutlinedIcon />
          </Button>
        </Box>
      )
    }
  ];
  /* Tabs Data */
  const tabs = [
    {
      label: 'Pending'
    },
    {
      label: 'Accepted'
    },
    {
      label: 'Rejected'
    }
  ];
  /* UseEffects */
  useEffect(() => {
    getLeaveRequest();
  }, []);
  useEffect(() => {
    handleFilterChange();
  }, [filters]);
  useEffect(() => {
    // Filter data whenever activeStep changes
    switch (activeStep) {
      case 1:
        setSortedData(rows.filter((row) => row.status === 'pending'));
        break;
      case 2:
        setSortedData(rows.filter((row) => row.status === 'approved'));
        break;
      case 3:
        setSortedData(rows.filter((row) => row.status === 'rejected'));
        break;
      default:
        setSortedData(rows);
    }
  }, [activeStep, rows]); // Dependencies: activeStep and rows

  return (
    <AdminDashboardPage title="Manage Leave Request">
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        {/* Left Section: Buttons */}
        <Grid item>
          <Grid container spacing={2}>
            <CustomTabs
              tabs={tabs} // Array of tab objects with labels and keys
              setActiveStep={setActiveStep}
            />
          </Grid>
        </Grid>

        {/* Right Section: Search Box */}
        <Grid item xs={4} sm={4} md={3}>
          <TextField
            fullWidth
            label="Search"
            size="small"
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            value={filters.searchText}
            onChange={(e) => {
              setFilters({ ...filters, searchText: e.target.value });
            }}
          />
        </Grid>
      </Grid>
      <DataTable
        columns={columns}
        rows={sortedData}
        totalRow={sortedData.length}
        isLoading={loading}
      />
      <CustomFormDailog
        open={openFormDailog}
        title="Leave Request"
        description="Manage leave request"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <TextInput
              fullWidth
              label="Name"
              value={initialValues.name}
              name="txtname"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextInput
              fullWidth
              label="Leave Type"
              value={initialValues.leaveName}
              name="leaveType"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextInput
              fullWidth
              label="FromDate"
              value={initialValues.from_date}
              name="fromDate"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextInput
              fullWidth
              label="ToDate"
              value={initialValues.to_date}
              name="ToDate"
              disabled
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={6}>
            <TextInput
              fullWidth
              label="No of Days"
              value={initialValues.noOfDays}
              name="Days"
            />
          </Grid> */}
          <Grid item xs={12} sm={12} md={12}>
            <TextInput
              fullWidth
              multiline
              label="Reason"
              value={initialValues.reason}
              name="Reason"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TextInput
              fullWidth
              multiline
              label="Remark"
              disabled={initialValues.status !== 'pending'}
              onChange={(e) => {
                setInitialValues((prev) => ({
                  ...prev,
                  remark: e.target.value
                }));
              }}
              value={initialValues.remark}
              name="Remark"
            />
          </Grid>
          {initialValues.document && (
            <Grid item xs={12} sm={12} md={12}>
              <CustomField name="document" label="Upload Document">
                <UploadSingleFile
                  name="document"
                  label="Upload"
                  file={initialValues.document}
                  // onFileChange={(val) => {
                  //   console.log('new file', val);
                  //   // setFieldValue('document', val);
                  //   setInitialValues((prev) => ({ ...prev, document: val }));
                  // }}
                  showRemoveButton={false}
                />
              </CustomField>
            </Grid>
          )}
          <Divider />
          <Grid container marginTop={3} justifyContent="space-between">
            <Grid item marginLeft={3}>
              <Button
                variant="contained"
                color="info"
                onClick={() => setOpenFormDailog(false)}
              >
                Close
              </Button>
            </Grid>
            <Grid item>
              {initialValues.status === 'pending' && (
                <Grid container spacing={2}>
                  <Grid item>
                    <LoadingButton
                      loading={isRejectSubmitting}
                      variant="contained"
                      onClick={() => {
                        if (initialValues.id) {
                          handleReject(initialValues.id);
                        }
                      }}
                      color="error"
                    >
                      Reject
                    </LoadingButton>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      loading={isAcceptSubmitting}
                      variant="contained"
                      color="success"
                      onClick={() => {
                        if (initialValues.id) {
                          handleLeaveAccept(initialValues.id);
                        }
                      }}
                    >
                      Accept
                    </LoadingButton>
                  </Grid>
                </Grid>
              )}
              {initialValues.status === 'rejected' && (
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="contained" disabled color="error">
                      Rejected
                    </Button>
                  </Grid>
                </Grid>
              )}
              {initialValues.status === 'approved' && (
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="contained" disabled color="success">
                      Accepted
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </CustomFormDailog>
    </AdminDashboardPage>
  );
};

export default ManageLeaveRequest;
