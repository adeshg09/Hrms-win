/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the theme context.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 22/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import React from 'react';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used for theme mode state.
 *
 * @interface IThemeContextState
 * @property {string} themeMode - theme mode state.
 * @property {func} switchMode - switch mode function for theme state.
 */
export interface IThemeContextState {
  themeMode: string;
  switchMode: (mode: string) => void;
}

/**
 * Interface used to define theme mode provider.
 *
 * @interface IThemeContextProps
 * @property {node} children - contains the child components.
 */
export interface IThemeContextProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/* Initial State */
const initialState: IThemeContextState = {
  themeMode: 'dark',
  switchMode: () => null
};

/* Create Context */
const ThemeContext = React.createContext<IThemeContextState>(initialState);

// ----------------------------------------------------------------------

/**
 * Component to define theme mode provider
 *
 * @component
 * @param {node} children - contains the child components
 * @returns {JSX.Element}
 */
class ThemeContextProvider extends React.Component<
  IThemeContextProps,
  IThemeContextState
> {
  /* Constructor */
  constructor(props: IThemeContextProps) {
    super(props);
    let selectedThemeMode = localStorage.getItem('themeMode');

    if (!selectedThemeMode) {
      selectedThemeMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      localStorage.setItem('themeMode', selectedThemeMode);
    }

    this.state = {
      themeMode: selectedThemeMode,
      switchMode: (newMode: string) => {
        this.setState((prevState) => ({
          ...prevState,
          themeMode: newMode
        }));
        localStorage.setItem('themeMode', newMode);
      }
    };
  }

  /* Output */
  render(): JSX.Element {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContext;
export { ThemeContextProvider };
