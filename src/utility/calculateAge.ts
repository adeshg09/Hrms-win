import moment from 'moment';

export const calculateAge = (birthDate: any): number => {
  if (!birthDate) return 0;
  return moment().diff(moment(birthDate), 'years');
};
