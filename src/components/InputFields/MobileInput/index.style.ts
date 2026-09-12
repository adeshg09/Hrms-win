export default {
  formLabelStyle: (theme: any) => ({
    position: 'relative',
    marginBottom: theme.spacing(1),
    width: '100%'
  }),
  formInputStyle: (theme: any) => ({
    paddingLeft: 0,
    '& .MuiSelect-select': {
      height: 48,
      padding: theme.spacing(2, 1.5),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
  }),
  formHelperTextStyle: (theme: any) => ({
    marginLeft: theme.spacing(0.5),
    marginTop: theme.spacing(0.5)
  }),
  countryCodeList: {
    maxHeight: 300,
    '& .MuiMenuItem-root': {
      height: 30
    }
  }
};
