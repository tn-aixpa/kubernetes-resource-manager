import { AuthProvider as RAAuthProvider } from 'react-admin';

import { BasicAuthProvider } from './authProviderBasic';
import { OAuth2AuthProvider } from './authProviderOAuth2';

export const AUTH_TYPE_BASIC = 'basic';
export const AUTH_TYPE_OAUTH2 = 'oauth2';
export const AUTH_TYPE_NONE = 'none';

export type AuthProvider = RAAuthProvider & {
    getAuthorization: () => Promise<void | false | string>;
};

export const NoneAuthProvider = (): AuthProvider => {
    const noop = () => {
        return Promise.resolve();
    };

    return {
        login: noop,
        logout: noop,
        checkAuth: noop,
        checkError: noop,
        getPermissions: () => {
            return Promise.resolve({canAccess: (resource: string, op: string) => true });
        },
        getAuthorization: noop,
    };
};

export const buildAuthProvider = (config: any): AuthProvider => {
    if (config && 'authentication' in config) {
        const type =
            'type' in config.authentication
                ? config.authentication.type
                : 'none';

        if (type === AUTH_TYPE_BASIC) {
            const baseUrl =
                'application' in config && 'apiUrl' in config.application
                    ? config.application.apiUrl
                    : '';
            return BasicAuthProvider(baseUrl + '/api/crd');
        } else if (type === AUTH_TYPE_OAUTH2 && 'oauth2' in config.authentication) {
            const baseUrl =
                'application' in config && 'apiUrl' in config.application
                    ? config.application.apiUrl
                    : '';
            const oauth2: [string, string, string, string] =
                config.authentication.oauth2;
            return OAuth2AuthProvider(baseUrl, ...oauth2);
        }
    }
    return NoneAuthProvider();
};
