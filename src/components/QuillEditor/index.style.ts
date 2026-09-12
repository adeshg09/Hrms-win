/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for quill editor component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 17/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

export default {
  rootStyle: (theme: any) => ({
    border: `1px solid ${theme.palette.grey[600]}`,
    '& .ql-active, .ql-picker-label:hover, .ql-bold:hover, .ql-italic:hover, .ql-link:hover, .ql-list:hover, .ql-image:hover, .ql-blockquote:hover':
      {
        color: `${theme.palette.secondary.main} !important`,
        '& .ql-stroke': {
          stroke: `${theme.palette.secondary.main} !important`
        },
        '& .ql-fill': {
          stroke: `${theme.palette.secondary.main} !important`
        }
      },
    '& .ql-toolbar, & .ql-container': {
      border: 'none !important'
    },
    '& .ql-container.ql-snow': {
      ...theme.typography.body2,
      fontFamily: theme.typography.fontFamily
    },
    '& .ql-blockquote': {
      transform: 'rotate(180deg)'
    },
    '& .ql-editor': {
      height: 200,
      borderTop: `1px solid ${theme.palette.grey[600]}`,
      '&.ql-blank::before': {
        fontStyle: 'normal',
        color: theme.palette.text.disabled
      },
      '& pre.ql-syntax': {
        ...theme.typography.body2,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey[900]
      }
    }
  })
};
