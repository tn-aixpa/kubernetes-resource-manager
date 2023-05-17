import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { AuthProvider } from 'react-admin';

const manager = new UserManager({
    authority: process.env.REACT_APP_AUTHORITY || '',
    client_id: process.env.REACT_APP_CLIENT_ID || '',
    redirect_uri:
        process.env.REACT_APP_REDIRECT_URI ||
        `${window.location.origin}/auth-callback`,
    scope: process.env.REACT_APP_SCOPE,
    userStore: new WebStorageStateStore({ store: localStorage }),
    loadUserInfo: true,
});

const authProvider: AuthProvider = {
    login: () => {
        return manager.signinRedirect();
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
        const isAuthenticated = await manager.getUser();
        return isAuthenticated ? Promise.resolve() : Promise.reject();
    },
    // remove local credentials and notify the auth server that the user logged out
    logout: () => {
        manager.removeUser();
        return Promise.resolve();
    },
    // get the user's profile
    getIdentity: async () => {
        const user = await manager.getUser();
        console.log(
            'getIdentity',
            user?.profile.sub,
            user?.profile.preferred_username
        );
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
        const query = window.location.search;
        if (query.includes('code=') && query.includes('state=')) {
            try {
                // get an access token based on the query paramaters
                const user = await manager.signinRedirectCallback();
                manager.storeUser(user);
                return;
            } catch (error) {
                console.log('error', error);
                throw error;
            }
        }
        throw new Error('Failed to handle login callback.');
    },
};

export default authProvider;
