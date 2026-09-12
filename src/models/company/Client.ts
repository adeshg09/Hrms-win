export interface ClientModel {
  id: number;
  name: string;
  country: string;
  company_name: string | null;
  created_by: number;
  created_date: string;
}

export interface ShortClientModel {
  id: number;
  name: string;
  country: string;
  company_name: string | null;
}

export interface ClientFormValues {
  txtClientName: string;
  txtCountry: string;
  txtCompanyName: string;
}
