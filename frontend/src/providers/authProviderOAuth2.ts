// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { AuthProvider } from './authProvider';

export const OAuth2AuthProvider = (
    baseUrl: string,
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

    const oauthGetAuthorization = async () => {
        const user = await userManager.getUser();
        if (user) {
            return Promise.resolve('Bearer ' + user.access_token);
        }

        return Promise.reject();    
    }

    return {
        getAuthorization: oauthGetAuthorization,
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
            sessionStorage.removeItem('user-permissions');
            return Promise.resolve();
        },
        // get the user's profile
        getIdentity: async () => {
            const user = await userManager.getUser();

            return Promise.resolve({
                id: user?.profile.sub ?? '',
                fullName: user?.profile.preferred_username,
            });
        },
        // get the user permissions (optional)
        getPermissions: async () => {
            if (sessionStorage.getItem('user-permissions')) {
                const permissions = JSON.parse(sessionStorage.getItem('user-permissions')!);
                permissions.canAccess = (resource: string, op: string) => (permissions[resource] && permissions[resource].indexOf(op) >= 0);
                return Promise.resolve(permissions);
            }

            const request = new Request(baseUrl +'/api/user', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': await oauthGetAuthorization(),
                }),
            });

            return fetch(request)
                .then(response => {
                    if (response.status < 200 || response.status >= 300) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .then(permissions => {
                    sessionStorage.setItem('user-permissions', JSON.stringify(permissions));
                    permissions.canAccess = (resource: string, op: string) => (permissions[resource] && permissions[resource].indexOf(op) >= 0);
                    return permissions;
                })
                .catch(() => {
                    throw new Error('Network error');
                });
        },
        handleCallback: async () => {
            // get an access token based on the query paramaters
            const user = await userManager.signinRedirectCallback();
            userManager.storeUser(user);
        },
    };
};

export default OAuth2AuthProvider;
