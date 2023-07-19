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
import crNuclioApiGateways from './resources/cr.nuclioapigateways.nuclio.io';

const customViews: { [index: string]: View } = {
    'postgres.db.movetokube.com': crPostgres,
    'postgresusers.db.movetokube.com': crPostgresUsers,
    'nuclioapigateways.nuclio.io': crNuclioApiGateways,
};

export const AUTH_TYPE_BASIC = 'basic';
export const AUTH_TYPE_OAUTH = 'oauth2';

//read config from ENV
const CONTEXT_PATH =
    (globalThis as any).REACT_APP_CONTEXT_PATH ||
    (process.env.REACT_APP_CONTEXT_PATH as string);
const API_URL: string =
    (globalThis as any).REACT_APP_API_URL ||
    (process.env.REACT_APP_API_URL as string);
const AUTH_CALLBACK_PATH: string = process.env
    .REACT_APP_AUTH_CALLBACK_PATH as string;

const APPLICATION_URL: string =
    (globalThis as any).REACT_APP_APPLICATION_URL ||
    (process.env.REACT_APP_APPLICATION_URL as string);
const AUTH_TYPE =
    (globalThis as any).REACT_APP_AUTH ||
    (process.env.REACT_APP_AUTH as string);

//build full config
const OAUTH2_REDIRECT_URL = APPLICATION_URL + AUTH_CALLBACK_PATH;
const OAUTH2_AUTHORITY =
    (globalThis as any).REACT_APP_AUTHORITY || process.env.REACT_APP_AUTHORITY;
const OAUTH2_CLIENT_ID =
    (globalThis as any).REACT_APP_CLIENT_ID || process.env.REACT_APP_CLIENT_ID;
const OAUTH2_SCOPE =
    (globalThis as any).REACT_APP_SCOPE || process.env.REACT_APP_SCOPE;

const manager = new UserManager({
    authority: OAUTH2_AUTHORITY || '',
    client_id: OAUTH2_CLIENT_ID || '',
    redirect_uri: OAUTH2_REDIRECT_URL,
    scope: OAUTH2_SCOPE,
    userStore: new WebStorageStateStore({ store: localStorage }),
    loadUserInfo: true,
});

const httpClient = async (url: string, options: Options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({
            Accept: 'application/json',
        }) as Headers;
    } else {
        options.headers = new Headers(options.headers) as Headers;
    }

    if (AUTH_TYPE === AUTH_TYPE_OAUTH) {
        const user = await manager.getUser();
        if (!user) {
            return Promise.reject('OAuth: No user found in store');
        }
        options.headers.set('Authorization', 'Bearer ' + user.access_token);
    } else if (AUTH_TYPE === AUTH_TYPE_BASIC) {
        const basicAuth = sessionStorage.getItem('basic-auth');
        if (!basicAuth) {
            return Promise.reject('Basic: No user found in store');
        }
        options.headers.set('Authorization', 'Basic ' + basicAuth);
    }

    if (!options.headers.has('Accept')) {
        options.headers.set('Accept', 'application/json');
    }

    return fetchUtils.fetchJson(url, options);
};

const dataProvider = appDataProvider(API_URL, manager, httpClient);

const getAuthProvider = () => {
    if (AUTH_TYPE === AUTH_TYPE_OAUTH) {
        return authProviderOAuth(manager);
    } else if (AUTH_TYPE === AUTH_TYPE_BASIC) {
        return authProviderBasic();
    }
};

const isAuthEnabled = () => {
    if (AUTH_TYPE === AUTH_TYPE_OAUTH || AUTH_TYPE === AUTH_TYPE_BASIC) {
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
        <BrowserRouter basename={CONTEXT_PATH}>
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
