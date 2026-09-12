/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Create module Page to add/edit modules.
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
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  // Box,
  Button,
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';
import Loader from 'components/Loader';
import { AdminDashboardPage } from 'components/Page';
import {
  AutoCompleteInput,
  SelectInput,
  TextInput
} from 'components/InputFields';
import { AdminFormLayout } from 'components/CardLayout';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { toastMessages } from 'constants/appConstant';
import {
  getCompanyModuleByIdRequest,
  getCompanyModulesRequest,
  insertCompanyModuleRequest,
  updateCompanyModuleRequest
} from 'services/master/companyModule';
import { getCompanySubModulesRequest } from 'services/master/companySubModule';
import { CompanyModuleFormValues, CompanyModuleModel } from 'models/master';
import { SubModuleModel } from 'models/master/CompanySubModule';

/* Local Imports */
import adminStyle from '../../master.style';

// ----------------------------------------------------------------------

/* Constants */
const manageModulePath = PAGE_ADMIN_DASHBOARD.companyModules.absolutePath;

// ----------------------------------------------------------------------

/**
 * Component to create the form to save/update module.
 *
 * @component
 * @returns {JSX.Element}
 */
const CreateModule = (): JSX.Element => {
  /* Hooks */
  const { id } = useParams();
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarClose();

  /* States */
  const [loading, setLoading] = useState(false);
  const [parentModules, setParentModules] = useState<Array<CompanyModuleModel>>(
    []
  );
  const [subModules, setSubModules] = useState<Array<SubModuleModel>>([]);
  const [initialValues, setInitialValues] = useState({
    txtModuleName: '',
    txtDisplayName: '',
    txtSummary: '',
    ddlParentModule: null,
    ddlSubModule: []
  } as CompanyModuleFormValues);

  /* Functions */

  /**
   * function to get the all parent modules with backend action
   * @returns {void}
   */
  const getParentModules = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getCompanyModulesRequest();
      if (response?.status.response_code === 200) {
        const ParentModules = response.company_modules.filter(
          (module: CompanyModuleModel) => module.parent_id === null
        );
        setParentModules(ParentModules);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get the all sub modules with backend action
   * @returns {void}
   */
  const getSubModules = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getCompanySubModulesRequest();
      if (response?.status.response_code === 200) {
        setSubModules(response.company_sub_modules || []);
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * function to get the module by id with backend action
   * @param {string} moduleId - id of module to fetch the detail
   * @returns {void}
   */
  const getModuleById = async (moduleId: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await getCompanyModuleByIdRequest(Number(moduleId));
      console.log('res is', response);
      if (response && response.status.response_code === 200) {
        const moduleData: CompanyModuleModel = response.company_module;
        setInitialValues({
          txtModuleName: moduleData.name,
          txtDisplayName: moduleData.display_name || '',
          txtSummary: moduleData.summary || '',
          ddlParentModule: moduleData.parent_id,
          ddlSubModule: moduleData.sub_modules?.map((item) => item.id) || []
        });
      } else {
        showSnackbar(toastMessages.error.common, 'error');
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
    setLoading(false);
  };

  /**
   * Submit function to save/update module with backend action
   * @param {ModuleFormValues} values - input values of form
   * @param {object} {resetForm} - function to reset the form
   * @returns {void}
   */
  const handleFormSubmit = async (
    values: CompanyModuleFormValues,
    { resetForm }: any
  ): Promise<void> => {
    try {
      const requestData: any = {
        name: values.txtModuleName.trim(),
        displayName: values.txtDisplayName.trim(),
        summary: values.txtSummary.trim(),
        parentId: values.ddlParentModule,
        // Only include subModuleIds if there are actually selections
        ...(values.ddlSubModule.length > 0 && {
          subModuleIds: JSON.stringify(values.ddlSubModule)
        })
      };
      if (id) {
        requestData.modifiedBy = user.id;
        const response = await updateCompanyModuleRequest(
          Number(id),
          requestData
        );
        if (response?.status.response_code === 200) {
          showSnackbar(
            toastMessages.success.adminDashboard.moduleUpdated,
            'success'
          );
          navigate(manageModulePath);
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.moduleDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      } else {
        requestData.createdBy = user.id;
        const response = await insertCompanyModuleRequest(requestData);
        if (response?.status.response_code === 200) {
          resetForm();
          showSnackbar(
            toastMessages.success.adminDashboard.moduleSaved,
            'success'
          );
        } else if (response?.status.response_code === 206) {
          showSnackbar(
            toastMessages.error.adminDashboard.moduleDuplicate,
            'error'
          );
        } else {
          showSnackbar(toastMessages.error.common, 'error');
        }
      }
    } catch {
      showSnackbar(toastMessages.error.common, 'error');
    }
  };

  /* Side-Effects */
  useEffect(() => {
    getParentModules();
    getSubModules();
    if (id) {
      getModuleById(id);
    }
  }, []);

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    // txtModuleName: Yup.string()
    //   .trim()
    //   .matches(
    //     /^[a-zA-Z0-9 ]+$/,
    //     'Please enter only alphabetics and/or numbers.'
    //   ),
    txtDisplayName: Yup.string()
      .trim()
      .required('Please enter the display name.'),
    txtSummary: Yup.string().trim().required('Please enter the summary.'),
    ddlParentModule: Yup.number().nullable(),
    ddlSubModule: Yup.array()
  });

  /* Output */
  return (
    <AdminDashboardPage title="Manage Modules">
      {!loading ? (
        <AdminFormLayout
          title={id ? 'Edit Module' : 'Add Module'}
          subtitle={
            id
              ? 'Please update the details below to update module.'
              : 'Please fill the below details to create new module.'
          }
        >
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue
            }) => (
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <CardContent>
                  <Grid container spacing={3}>
                    {/* <Grid item md={12} sm={12} xs={12}>
                      <TextInput
                        fullWidth
                        label="Module Name"
                        name="txtModuleName"
                        value={values.txtModuleName}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtModuleName && errors.txtModuleName
                        )}
                        helperText={String(
                          touched.txtModuleName && errors.txtModuleName
                        )}
                      />
                    </Grid> */}
                    <Grid item md={12} sm={12} xs={12}>
                      <TextInput
                        fullWidth
                        label="Display Name"
                        name="txtDisplayName"
                        value={values.txtDisplayName}
                        inputProps={{ maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.txtDisplayName && errors.txtDisplayName
                        )}
                        helperText={String(
                          touched.txtDisplayName && errors.txtDisplayName
                        )}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <TextInput
                        fullWidth
                        multiline
                        label="Summary"
                        name="txtSummary"
                        value={values.txtSummary}
                        rows={2}
                        inputProps={{ maxLength: 500 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.txtSummary && errors.txtSummary)}
                        helperText={String(
                          touched.txtSummary && errors.txtSummary
                        )}
                        sx={adminStyle.textMultilineInputStyle}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <SelectInput
                        label="Select Parent Module"
                        name="ddlParentModule"
                        value={values.ddlParentModule}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.ddlParentModule && errors.ddlParentModule
                        )}
                        helperText={String(
                          touched.ddlParentModule && errors.ddlParentModule
                        )}
                      >
                        <MenuItem key="-1" value="">
                          - None -
                        </MenuItem>
                        {parentModules.map((option: any) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.display_name}
                          </MenuItem>
                        ))}
                      </SelectInput>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <AutoCompleteInput
                        multiple
                        label="Select Sub Module"
                        name="ddlSubModule"
                        value={values.ddlSubModule}
                        data={
                          subModules?.map((val: SubModuleModel) => val.id) || []
                        }
                        originalData={subModules}
                        itemId="id"
                        itemName="display_name"
                        placeholder="Search Sub Module"
                        limitTags={2}
                        renderOption={(
                          props: any,
                          option: any,
                          { selected }: any
                        ) => (
                          <MenuItem {...props}>
                            <Checkbox checked={selected} />
                            {subModules?.find(
                              (val: SubModuleModel) => val.id === option
                            )?.display_name || ''}
                          </MenuItem>
                        )}
                        onChange={(e: any) => {
                          setFieldValue('ddlSubModule', e);
                        }}
                        error={Boolean(
                          touched.ddlSubModule && errors.ddlSubModule
                        )}
                        helperText={String(
                          touched.ddlSubModule && errors.ddlSubModule
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    {id ? 'Update' : 'Save'}
                  </LoadingButton>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => navigate(manageModulePath)}
                  >
                    {id ? 'Cancel' : 'Back'}
                  </Button>
                </CardActions>
              </Form>
            )}
          </Formik>
        </AdminFormLayout>
      ) : (
        <Loader />
      )}
    </AdminDashboardPage>
  );
};

export default CreateModule;
