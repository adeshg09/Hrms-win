/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to styles for tree select component.
 * --------------------------------------------------------------------
 * Creation Details
 * Date Created: 22/Jan/2025
 */

// ----------------------------------------------------------------------

export default {
  formControlStyle: () => ({
    width: '100%',
    '& .mdl-tree-select': {
      width: '100%',
      marginTop: '5px',
      '& .dropdown-trigger': {
        borderRadius: '4px',
        padding: '12px 16px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        transition: 'border-color 0.2s',
        '&:focus': {
          borderColor: '#1976d2',
          outline: 'none'
        },
        '&:hover': {
          borderColor: '#1976d2'
        }
      },
      '&.error .dropdown-trigger': {
        borderColor: '#d32f2f'
      },
      '& .dropdown-content': {
        marginTop: '8px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        // boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        // backgroundColor: '#ffffff',
        '& .node': {
          padding: '12px 16px',
          fontSize: '14px',
          color: '#333',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }
      },
      '& .search-box': {
        padding: '8px 16px',
        '& input': {
          width: '100%',
          border: 'none',
          outline: 'none'
        }
      }
    }
  }),
  formLabelStyle: (theme: any) => ({
    position: 'relative',
    marginBottom: theme.spacing(0.5),
    width: '100%'
  }),
  formHelperTextStyle: (theme: any) => ({
    marginLeft: theme.spacing(0.5),
    marginTop: theme.spacing(0.5)
  })
};
