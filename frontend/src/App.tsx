import './App.css';
import appDataProvider from './dataProvider';
import { BrowserRouter } from 'react-router-dom';
import {
    AdminContext,
    AdminUI,
    Loading,
    Resource,
    defaultTheme,
    localStorageStore,
} from 'react-admin';
import {
    SchemaList,
    SchemaEdit,
    SchemaCreate,
    SchemaShow,
} from './resources/crs';
import { CrdList, CrdShow } from './resources/crd';
import authenticationProvider from './authProvider';
import { SSOLogin } from './components/SSOLogin';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useUpdateCrdIds } from './hooks/useUpdateCrdIds';
import { i18nProvider } from './i18nProvider';
import SettingsIcon from '@mui/icons-material/Settings';
import MyLayout from './components/Layout';
import MyDashboard from './components/Dashboard';

const API_URL: string = process.env.REACT_APP_API_URL as string;

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

const dataProvider = appDataProvider(API_URL, manager);
const authProvider = authenticationProvider(manager);
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
                authProvider={authProvider}
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
    const { getViewsList } = useUpdateCrdIds();
    // TODO fix: Views will not load on refresh if CrdIds is set
    return (
        <AdminUI
            ready={Loading}
            dashboard={MyDashboard}
            loginPage={SSOLogin}
            layout={MyLayout}
            requireAuth
        >
            {getViewsList().map((v: any) => (
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
                options={{ label: 'Settings' }}
            />
            <Resource
                name="crd"
                options={{ label: 'CRDs' }}
                recordRepresentation="id"
            />
        </AdminUI>
    );
}

export default App;
