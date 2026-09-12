/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the font family and styles based.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 15/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Relative Imports */
import { pxToRem } from 'utility/formatFontSize';

// ----------------------------------------------------------------------

type FontSizeMeasurement = {
  sm: number;
  md: number;
  lg: number;
};

// ----------------------------------------------------------------------

/**
 * To set fontsize according to the width of the screen.
 *
 * @param sm - small font size
 * @param md - medium font size
 * @param lg - large font size
 * @returns font size based on the width of the screen
 */
function responsiveFontSizes({ sm, md, lg }: FontSizeMeasurement): any {
  return {
    '@media (min-width:768px)': {
      fontSize: pxToRem(sm)
    },
    '@media (min-width:1024px)': {
      fontSize: pxToRem(md)
    },
    '@media (min-width:1440px)': {
      fontSize: pxToRem(lg)
    }
  };
}

/* Constants */
const fonts: any = {
  Aleo_Bold: 'Aleo-Bold',
  Aleo_Italic: 'Aleo-Italic',
  Aleo_Light: 'Aleo-Light',
  Aleo_Regular: 'Aleo-Regular',
  Mulish_Black: 'Mulish-Black',
  Mulish_Bold: 'Mulish-Bold',
  Mulish_ExtraBold: 'Mulish-ExtraBold',
  Mulish_ExtraLight: 'Mulish-ExtraLight',
  Mulish_Italic: 'Mulish-Italic',
  Mulish_Light: 'Mulish-Light',
  Mulish_Medium: 'Mulish-Medium',
  Mulish_Regular: 'Mulish-Regular',
  Mulish_SemiBold: 'Mulish-SemiBold'
};

const typography: any = {
  fontFamily: fonts.Mulish_Regular,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fonts,
  h1: {
    fontFamily: fonts.Aleo_Bold,
    fontWeight: 700,
    lineHeight: 1,
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 })
  },
  h2: {
    fontFamily: fonts.Aleo_Bold,
    fontWeight: 700,
    lineHeight: 1,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 })
  },
  h3: {
    fontFamily: fonts.Aleo_Bold,
    fontWeight: 700,
    lineHeight: 1,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 })
  },
  h4: {
    fontFamily: fonts.Aleo_Regular,
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 })
  },
  h5: {
    fontFamily: fonts.Aleo_Regular,
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 })
  },
  h6: {
    fontFamily: fonts.Aleo_Regular,
    fontWeight: 400,
    lineHeight: 28 / 18,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 })
  },
  subtitle1: {
    fontFamily: fonts.Mulish_SemiBold,
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16)
  },
  subtitle2: {
    fontFamily: fonts.Mulish_Medium,
    fontWeight: 500,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14)
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16)
  },
  body2: {
    lineHeight: 1.5,
    fontSize: pxToRem(14)
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12)
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  button: {
    fontWeight: 'normal',
    lineHeight: 1.2,
    fontSize: pxToRem(14),
    textTransform: 'capitalize'
  }
};

export default typography;
