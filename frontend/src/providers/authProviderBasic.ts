// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { AuthProvider } from './authProvider';

export const BasicAuthProvider = (loginUrl?: string): AuthProvider => {
    return {
        getAuthorization: () => {
            const basicAuth = sessionStorage.getItem('basic-auth');
            if (basicAuth) {
                return Promise.resolve('Basic ' + basicAuth);
            }

            return Promise.reject();
        },
        login: ({ username, password }) => {
            if (loginUrl) {
                const request = new Request(loginUrl, {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        Authorization:
                            'Basic ' + btoa(username + ':' + password),
                    }),
                });

                return fetch(request)
                    .then(response => {
                        if (response.status < 200 || response.status >= 300) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(auth => {
                        sessionStorage.setItem('basic-user', username);
                        sessionStorage.setItem(
                            'basic-auth',
                            btoa(username + ':' + password)
                        );
                    })
                    .catch(() => {
                        throw new Error('Network error');
                    });
            } else {
                sessionStorage.setItem('basic-user', username);
                sessionStorage.setItem(
                    'basic-auth',
                    btoa(username + ':' + password)
                );
                return Promise.resolve();
            }
        },
        // when the dataProvider returns an error, check if this is an authentication error
        checkError: error => {
            const status = error.status;
            if (status === 401 || status === 403) {
                sessionStorage.removeItem('basic-user');
                sessionStorage.removeItem('basic-auth');
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        // when the user navigates, make sure that their credentials are still valid
        checkAuth: () => {
            console.log('checkAuth');
            return sessionStorage.getItem('basic-auth')
                ? Promise.resolve()
                : Promise.reject();
        },
        // remove local credentials and notify the auth server that the user logged out
        logout: () => {
            sessionStorage.removeItem('basic-user');
            sessionStorage.removeItem('basic-auth');
            return Promise.resolve();
        },
        // get the user's profile
        getIdentity: async () => {
            const user = sessionStorage.getItem('basic-user');
            if (user) {
                const id = user;
                const fullName = user;
                const avatar = '';

                return Promise.resolve({ id, fullName, avatar });
            }

            return Promise.reject();
        },
        // get the user permissions (optional)
        getPermissions: () => {
            return Promise.resolve({canAccess: (resource: string, op: string) => true });
        },
    };
};

export default BasicAuthProvider;
