/* Create Employee Form interfaces */
export interface AddUserFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword: string;
  txtPhone?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;
}
export interface UserValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  roles: Array<number>;
  is_active: boolean;
  show_activity?: boolean;
}

export interface AddEmployeePersonalDetailsFormValues {
  txtBirthDate: string;
  txtAge: number | null;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  ddlGender: string;
  ddlMaritalStatus: string;
  txtMarriageDate?: string;
  ddlBloodGroup: string;
  txtPanNumber: string;
  txtCaste: string;
  txtReligion: string;
  txtResidence?: string;
}

export interface PersonalDetailsValues {
  id?: number | null;
  birth_date: string;
  age: number;
  birth_country: string;
  birth_state: string;
  birth_location: string;
  gender: string;
  marital_status: string;
  marriage_date?: string;
  blood_group: string;
  pan_number: string;
  caste: string;
  religion: string;
  residence?: string;
}

export interface AddEmployeeProfessionalDetailsFormValues {
  txtEmployeeCode: string;
  ddlDesignation: number | '';
  ddlReportingUser: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;
}
export interface ProfessionalDetailsValues {
  employee_code: string;
  designation_id: number | '';
  reporting_user_id: number | '';
  joining_date: string;
  employment_type: string;
  working_type: string;
}

export interface AddEmployeeFamilyDetailsFormValues {
  ddlRelationType: string;
  txtName: string;
  txtOccupation: string;
  txtPhone: string;
}

export interface AddEmployeeEmergencyContactDetailsFormValues {
  txtContactName: string;
  txtContactAddress: string;
  ddlContactRelation: string;
  txtPhone: string;
}

export interface AddressDetailsValues {
  address_type: string;
  building_name: string;
  flat_number: string;
  street_name: string;
  landmark: string;
  city: string;
  country: string;
  state: string;
  pincode: string;
  telephone_number: string;
  phone: string;
}

export interface AddEmployeeAddressDetailsFormValues {
  ddlAddressType: string;
  txtBuildingName?: string;
  txtFlatNumber?: string;
  txtStreetName?: string;
  txtLandmark?: string;
  txtCity: string;
  ddlCountry: string;
  ddlState: string;
  txtPincode: string;
  txtPhone?: string;
}

export interface AddEmployeeEducationDetailsFormValues {
  ddlCourse: string;
  txtDegreeSpecialization: string;
  txtInstituteName: string;
  txtFromDate: string;
  txtToDate: string;
  ddlStatus: string;
  ddlStudyMode: string;
  txtPercentage: string;
}

export interface AddEmployeeExperienceDetailsFormValues {
  txtCompanyName: string;
  txtEmployeeId: string;
  txtJobTitle: string;
  txtStartDate: string;
  txtEndDate: string;
  ddlCountry: string;
  txtCity: string;
  ddlState: string;
  ddlEmploymentType: string;
  txtSupervisorName: string;
  txtSupervisorPhone: string;
}

export interface AddEmployeeDocumentsFormValues {
  documentTypeId: number;
  employeeDocument: File | string | null;
}

export interface AddEmployeeDetailsFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword: string;
  txtPhone?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;

  txtBirthDate: string;
  txtAge: number | null;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  ddlGender: string;
  ddlMaritalStatus: string;
  txtMarriageDate?: string;
  ddlBloodGroup: string;
  txtPanNumber: string;
  txtCaste: string;
  txtReligion: string;
  txtResidence?: string;

  txtEmployeeCode: string;
  ddlDesignation?: number | '';
  ddlReportingUser: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;

  addressDetails: AddEmployeeAddressDetailsFormValues[];
  familyDetails: AddEmployeeFamilyDetailsFormValues[];
  educationDetails: AddEmployeeEducationDetailsFormValues[];
  emergencyContactDetails: AddEmployeeEmergencyContactDetailsFormValues[];
  experienceDetails: AddEmployeeExperienceDetailsFormValues[];
  documentDetails: AddEmployeeDocumentsFormValues[];
}
export interface EditEmployeeDetailsFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword: string;
  txtPhone?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;

  txtBirthDate: string;
  txtAge: number | null;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  ddlGender: string;
  ddlMaritalStatus: string;
  txtMarriageDate?: string;
  ddlBloodGroup: string;
  txtPanNumber: string;
  txtCaste: string;
  txtReligion: string;
  txtResidence?: string;

  txtEmployeeCode: string;
  ddlDesignation?: number | '';
  ddlReportingUser: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;

  addressDetails: EditEmployeeAddressDetailsFormValues[];
  familyDetails: EditEmployeeFamilyDetailsFormValues[];
  educationDetails: EditEmployeeEducationDetailsFormValues[];
  emergencyContactDetails: EditEmployeeEmergencyContactDetailsFormValues[];
  experienceDetails: EditEmployeeExperienceDetailsFormValues[];
  documentDetails: AddEmployeeDocumentsFormValues[];
}

/* Edit Employee Form interfaces */
export interface EditUserFormValues {
  txtFirstName: string;
  txtLastName: string;
  txtEmail: string;
  txtPassword: string;
  txtPhone?: string;
  ddlRoles: Array<number>;
  chkIsActive: boolean;
  chkShowActivity?: boolean;
}

export interface EditEmployeePersonalDetailsFormValues {
  txtId?: number | null;
  txtBirthDate: string;
  txtAge: number;
  ddlBirthCountry: string;
  ddlBirthState: string;
  txtBirthLocation: string;
  ddlGender: string;
  ddlMaritalStatus: string;
  txtMarriageDate?: string;
  ddlBloodGroup: string;
  txtPanNumber: string;
  txtCaste: string;
  txtReligion: string;
  txtResidence?: string;
}

export interface EditEmployeeProfessionalDetailsFormValues {
  txtEmployeeCode: string;
  ddlDesignation: number | '';
  ddlReportingUser: number | '';
  txtJoinDate: string;
  ddlEmploymentType: string;
  ddlWorkingType: string;
}

export interface EditEmployeeFamilyDetailsFormValues {
  txtId?: number | null;
  ddlRelationType: string;
  txtName: string;
  txtAge?: string;
  txtBirthDate?: string;
  txtCurrentAddress?: string;
  ddlBirthCountry?: string;
  ddlBirthState?: string;
  txtBirthLocation?: string;
  txtOccupation: string;
  txtPhone: string;
}

export interface EditEmployeeEmergencyContactDetailsFormValues {
  txtId?: number | null;
  txtContactName: string;
  txtContactAddress: string;
  ddlContactRelation: string;
  txtPhone: string;
}

export interface EditEmployeeAddressDetailsFormValues {
  txtId?: number | null;
  ddlAddressType: string;
  txtBuildingName: string;
  txtFlatNumber: string;
  txtStreetName: string;
  txtLandmark: string;
  txtCity: string;
  ddlCountry: string;
  ddlState: string;
  txtPincode: string;
  txtTelephoneNumber?: string;
  txtPhone: string;
}

export interface EditEmployeeEducationDetailsFormValues {
  txtId?: number | null;
  ddlCourse: string;
  txtDegreeSpecialization: string;
  txtInstituteName: string;
  txtFromDate: string;
  txtToDate: string;
  ddlStatus: string;
  ddlStudyMode: string;
  txtPercentage: string;
}

export interface EditEmployeeExperienceDetailsFormValues {
  txtId?: number | null;
  txtCompanyName: string;
  txtEmployeeId: string;
  txtJobTitle: string;
  txtStartDate: string;
  txtEndDate: string;
  ddlCountry: string;
  txtCity: string;
  ddlState: string;
  ddlEmploymentType: string;
}
