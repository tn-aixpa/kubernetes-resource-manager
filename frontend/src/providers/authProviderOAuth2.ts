import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { AuthProvider } from './authProvider';

export const OAuth2AuthProvider = (
    authority: string,
    clientId: string,
    redirectUri: string,
    scope: string = 'openid'
): AuthProvider => {
    const userManager = new UserManager({
        authority: authority,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        loadUserInfo: true,
    });

    return {
        getAuthorization: async () => {
            const user = await userManager.getUser();
            if (user) {
                return Promise.resolve('Bearer ' + user.access_token);
            }

            return Promise.reject();
        },
        login: () => {
            return userManager.signinRedirect();
        },
        // when the dataProvider returns an error, check if this is an authentication error
        checkError: error => {
            console.log('checkError method', error);
            const status = error.status;
            if (status === 401 || status === 403) {
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        // when the user navigates, make sure that their credentials are still valid
        checkAuth: async () => {
            const isAuthenticated = await userManager.getUser();
            return isAuthenticated ? Promise.resolve() : Promise.reject();
        },
        // remove local credentials and notify the auth server that the user logged out
        logout: () => {
            userManager.removeUser();
            return Promise.resolve();
        },
        // get the user's profile
        getIdentity: async () => {
            const user = await userManager.getUser();

            return Promise.resolve({
                id: user?.profile.sub || '',
                fullName: user?.profile.preferred_username,
            });
        },
        // get the user permissions (optional)
        getPermissions: () => {
            return Promise.resolve();
        },
        handleCallback: async () => {
            try {
                // get an access token based on the query paramaters
                const user = await userManager.signinRedirectCallback();
                userManager.storeUser(user);
                return;
            } catch (error) {
                throw error;
            }
        },
    };
};

export default OAuth2AuthProvider;
