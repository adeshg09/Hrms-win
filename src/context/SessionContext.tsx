import React from 'react';
import { PAGE_ROOT } from 'routes/paths';
import {
  getAccessToken,
  isValidToken,
  removeAccessToken,
  setAccessToken
} from 'helper/authHelper';
import { getProfileRequest } from 'services/account';
import { getCompanyProfileSubModulesRequest } from 'services/master/companySubModule';

export interface ISessionState {
  isAuthenticated: boolean;
  authToken: string | null;
  user: any | null;
  primaryAccessRole: string | null;
  companySubmodules: string[] | null;
  isPageLoaded: boolean | null;
  LoginUser: (token: string, rememberMe: boolean) => void;
  LogoutUser: () => void;
  updateProfilePicture: (profilephoto: string) => void;
}

export interface ISessionProps {
  children: React.ReactNode;
}

const initialState: ISessionState = {
  isAuthenticated: false,
  authToken: null,
  isPageLoaded: true,
  user: null,
  primaryAccessRole: null,
  companySubmodules: null,
  LoginUser: async () => {},
  LogoutUser: () => {},
  updateProfilePicture: () => {}
};

const SessionContext = React.createContext<ISessionState>(initialState);

class Session extends React.Component<ISessionProps, ISessionState> {
  constructor(props: ISessionProps) {
    super(props);

    const accessToken: any = getAccessToken();
    const user = isValidToken(accessToken);

    this.state = {
      isAuthenticated: Boolean(accessToken && user),
      authToken: accessToken,
      user: null,
      primaryAccessRole: null,
      companySubmodules: null,
      isPageLoaded: true,
      LoginUser: async (token, rememberMe) => {
        localStorage.setItem('updateDialogBox', 'open');
        setAccessToken(token, rememberMe);
        this.setState((prevState) => ({
          ...prevState,
          isAuthenticated: true,
          authToken: token
        }));
        await this.getUserProfile();
      },
      LogoutUser: () => {
        localStorage.removeItem('updateDialogBox');
        removeAccessToken();

        // Added null check to prevent potential runtime error
        if (this.state.user?.profile_photo) {
          URL.revokeObjectURL(this.state.user.profile_photo);
        }

        this.setState((prevState) => ({
          ...prevState,
          isAuthenticated: false,
          authToken: null,
          user: null,
          primaryAccessRole: null,
          companySubmodules: null
        }));
        window.location.href = PAGE_ROOT.signIn.absolutePath;
      },
      updateProfilePicture: (profilePicture) => {
        this.setState((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            profile_photo: profilePicture
          }
        }));
      }
    };

    // Bind methods to the class instance
    this.getUserProfile = this.getUserProfile.bind(this);
    this.getCompanySubModules = this.getCompanySubModules.bind(this);
  }

  componentDidMount(): void {
    if (this.state.authToken) {
      this.getUserProfile();
      // this.getCompanySubModules();
    } else {
      this.setState((prevState) => ({
        ...prevState,
        isPageLoaded: false
      }));
    }
  }

  /**
   * Function to get company submodules
   * @returns {Promise<string[] | null>} Company submodules
   */
  /* eslint-disable-next-line class-methods-use-this */
  async getCompanySubModules(): Promise<string[] | null> {
    try {
      const response: any = await getCompanyProfileSubModulesRequest();
      if (response && response.status.response_code === 200) {
        return response?.companySubModules.map(
          (subModule: any) => subModule?.sub_module_name
        );
      }
      return null;
    } catch (error) {
      console.error('Error fetching company submodules:', error);
      return null;
    }
  }

  async getUserProfile(): Promise<void> {
    try {
      const response: any = await getProfileRequest(this.state.authToken || '');
      if (response?.status.response_code === 200 && response?.user) {
        const rolesArray = response.user.profile.roles;
        let primaryRole = '';

        if (rolesArray.some((x: any) => x.name.toLowerCase() === 'admin')) {
          primaryRole = 'admin';
        } else if (
          rolesArray.some(
            (x: any) => x.name.toLowerCase() === 'content manager'
          )
        ) {
          primaryRole = 'contentManager';
        } else {
          primaryRole = 'user';
        }

        if (
          response?.user?.company &&
          !response?.user?.profile?.is_super_admin
        ) {
          const companySubmodules = await this.getCompanySubModules();
          console.log('companySub Modules', companySubmodules);
          this.setState((prevState) => ({
            ...prevState,
            user: response.user,
            primaryAccessRole: primaryRole,
            companySubmodules,
            isPageLoaded: false
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            user: response.user,
            primaryAccessRole: primaryRole,
            isPageLoaded: false
          }));
        }
      }
    } catch (error) {
      // Use a method reference instead of state method
      this.state.LogoutUser();

      this.setState((prevState) => ({
        ...prevState,
        isPageLoaded: false
      }));
    }
  }

  render(): JSX.Element {
    return (
      <SessionContext.Provider value={this.state}>
        {!this.state.isPageLoaded && this.props.children}
      </SessionContext.Provider>
    );
  }
}

export default SessionContext;
export const SessionProvider = Session;
export const SessionConsumer = SessionContext.Consumer;
