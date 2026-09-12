import { employeePersonalDetails } from 'constants/appConstant';

export const formatBloodGroupValues = (value: string): any => {
  return employeePersonalDetails.bloodGroups.find(
    (item) => item.value === value
  )?.name;
};
