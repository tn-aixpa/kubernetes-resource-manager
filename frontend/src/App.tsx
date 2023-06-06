import './App.css';
import appDataProvider from './dataProvider';
import { BrowserRouter } from 'react-router-dom';
import {
    AdminContext,
    AdminUI,
    Loading,
    Options,
    Resource,
    defaultTheme,
    fetchUtils,
    localStorageStore,
} from 'react-admin';
import {
    SchemaList,
    SchemaEdit,
    SchemaCreate,
    SchemaShow,
} from './resources/crs';
import authProviderOAuth from './authProviderOAuth';
import authProviderBasic from './authProviderBasic';
import Login from './pages/Login';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useUpdateCrdIds } from './hooks/useUpdateCrdIds';
import { i18nProvider } from './i18nProvider';
import SettingsIcon from '@mui/icons-material/Settings';
import MyLayout from './Layout';
import MyDashboard from './pages/Dashboard';
import { CrdShow } from './resources/crd';
import { useContext, useState } from 'react';
import { View, ViewsContext, fetchViews } from './resources';
import crPostgres from './resources/cr.postgres.db.movetokube.com';
import crPostgresUsers from './resources/cr.postgresusers.db.movetokube.com';

const customViews: { [index: string]: View } = {
    'postgres.db.movetokube.com': crPostgres,
    'postgresusers.db.movetokube.com': crPostgresUsers,
};

export const AUTH_TYPE_BASIC = 'basic';
export const AUTH_TYPE_OAUTH = 'oauth';

const API_URL: string = process.env.REACT_APP_API_URL as string;

const authType = process.env.REACT_APP_AUTH;

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

const httpClient = async (url: string, options: Options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    if (authType === AUTH_TYPE_OAUTH) {
        const user = await manager.getUser();
        if (!user) {
            return Promise.reject('OAuth: No user found in store');
        }
        options.user = {
            authenticated: true,
            token: 'Bearer ' + user.access_token,
        };
    } else if (authType === AUTH_TYPE_BASIC) {
        const basicAuth = sessionStorage.getItem('basic-auth');
        if (!basicAuth) {
            return Promise.reject('Basic: No user found in store');
        }
        options.headers = new Headers({
            Accept: 'application/json',
            Authorization: 'Basic ' + basicAuth,
        });
    }

    return fetchUtils.fetchJson(url, options);
};

const dataProvider = appDataProvider(API_URL, manager, httpClient);

const getAuthProvider = () => {
    if (authType === AUTH_TYPE_OAUTH) {
        return authProviderOAuth(manager);
    } else if (authType === AUTH_TYPE_BASIC) {
        return authProviderBasic();
    }
};

const isAuthEnabled = () => {
    if (authType === AUTH_TYPE_OAUTH || authType === AUTH_TYPE_BASIC) {
        return true;
    }

    return false;
};

const store = localStorageStore();

export const themeOptions = {
    ...defaultTheme,
    palette: {
        secondary: {
            main: '#204372',
        },
    },
    sidebar: {
        width: 320, // The default value is 240
    },
};

function App() {
    return (
        <BrowserRouter>
            <AdminContext
                dataProvider={dataProvider}
                authProvider={getAuthProvider()}
                i18nProvider={i18nProvider}
                store={store}
                theme={themeOptions}
            >
                <DynamicAdminUI />
            </AdminContext>
        </BrowserRouter>
    );
}

function DynamicAdminUI() {
    const [views, setViews] = useState<View[]>([]);
    const { crdIds } = useUpdateCrdIds();

    const viewsContext = useContext(ViewsContext);
    for (const crdId of crdIds) {
        try {
            if (
                crdId in customViews &&
                !viewsContext.list().some(v => v.key === crdId)
            ) {
                viewsContext.put(customViews[crdId]);
            }
        } catch (error) {
            console.log('No custom view for', crdId);
        }

        if (
            views.length !== crdIds.length ||
            !views.every((s: View) => crdIds.includes(s.key))
        ) {
            setViews(fetchViews(crdIds));
        }
    }

    return (
        <AdminUI
            ready={Loading}
            dashboard={MyDashboard}
            loginPage={Login}
            layout={MyLayout}
            requireAuth={isAuthEnabled()}
        >
            {views.map((v: any) => (
                <Resource
                    name={v.key}
                    options={{ label: v.name }}
                    key={v.key}
                    list={v.list}
                    show={v.show}
                    create={v.create}
                    edit={v.edit}
                    icon={v.icon}
                />
            ))}
            <Resource
                name="crs"
                list={SchemaList}
                edit={SchemaEdit}
                create={SchemaCreate}
                show={SchemaShow}
                icon={SettingsIcon}
            />
            <Resource name="crd" show={CrdShow} recordRepresentation="id" />
        </AdminUI>
    );
}

export default App;
