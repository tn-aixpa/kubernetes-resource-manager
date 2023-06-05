import { AuthProvider } from 'react-admin';

const authProviderBasic = (): AuthProvider => {
    return {
        login: ({ username, password }) => {
            console.log('AP: login');
            const testBasicAuthURL = process.env.REACT_APP_API_URL + '/api/crd';
            const request = new Request(testBasicAuthURL, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + btoa(username + ':' + password),
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
                    console.log(auth);
                    localStorage.setItem('basic-user', username);
                    localStorage.setItem(
                        'basic-auth',
                        btoa(username + ':' + password)
                    );
                })
                .catch(() => {
                    throw new Error('Network error');
                });
        },
        // when the dataProvider returns an error, check if this is an authentication error
        checkError: error => {
            console.log('AP: checkError');
            const status = error.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('basic-user');
                localStorage.removeItem('basic-auth');
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        // when the user navigates, make sure that their credentials are still valid
        checkAuth: () => {
            console.log('AP: checkAuth');
            return localStorage.getItem('basic-auth')
                ? Promise.resolve()
                : Promise.reject();
        },
        // remove local credentials and notify the auth server that the user logged out
        logout: () => {
            console.log('AP: logout');
            localStorage.removeItem('basic-user');
            localStorage.removeItem('basic-auth');
            return Promise.resolve();
        },
        // get the user's profile
        getIdentity: async () => {
            console.log('AP: getIdentity');
            const user = localStorage.getItem('basic-user');
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
            console.log('AP: getPermissions');
            return Promise.resolve();
        },
    };
};

export default authProviderBasic;
