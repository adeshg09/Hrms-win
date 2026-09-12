/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create quill editor component.
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

/* Imports */
import React, { memo } from 'react';
import ReactQuill from 'react-quill';
import { Box } from '@mui/material';
import 'react-quill/dist/quill.snow.css';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * @interface Props
 * @property {string} value - context which will be shared
 * @property {string} placeholder - placeholder for input field
 * @property {function} setFieldValue - will set value for the emailbody
 */
export interface Props {
  value: string;
  placeholder: string;
  setFieldValue: (val: string) => void;
}

// ----------------------------------------------------------------------
/**
 * @Components
 * @property {string} value - context which will be shared
 * @property {string} placeholder - placeholder for input field
 * @property {function} setFieldValue - will set value for the emailbody
 *
 * @returns {JSX.Element}
 */
const QuillEditor = ({
  value,
  placeholder,
  setFieldValue
}: Props): JSX.Element => {
  /* Constants */
  const Size = ReactQuill.Quill.import('attributors/style/size');
  Size.whitelist = ['12px', '14px', '16px', '18px'];
  ReactQuill.Quill.register(Size, true);
  const modules = {
    toolbar: [
      [{ font: [] }],
      [
        { size: ['12px', '14px', '16px', '18px'] },
        'bold',
        'italic',
        'link',
        { list: 'ordered' },
        { list: 'bullet' },
        'image',
        'blockquote'
      ]
    ]
  };

  /* Output */
  return (
    <Box sx={styles.rootStyle}>
      <ReactQuill
        value={value}
        onChange={(val) => {
          setFieldValue(val);
        }}
        placeholder={placeholder}
        modules={modules}
        theme="snow"
      />
    </Box>
  );
};

export default memo(QuillEditor);
