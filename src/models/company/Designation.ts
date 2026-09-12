export interface DesignationModel {
  id: number;
  name: string;
  created_by: number;
  created_date: string;
}

export interface ShortDesignationModel {
  id: number;
  name: string;
}

export interface DesignationFormValues {
  txtDesignationName: string;
}
