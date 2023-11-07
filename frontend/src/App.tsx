import './App.css';
import appDataProvider from './providers/dataProvider';
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

import Login from './pages/Login';
import { useUpdateCrdIds } from './hooks/useUpdateCrdIds';
import { i18nProvider } from './providers/i18nProvider';
import SettingsIcon from '@mui/icons-material/Settings';
import MyLayout from './Layout';
import MyDashboard from './pages/Dashboard';
import { CrdShow } from './resources/crd';
import { useContext, useState } from 'react';
import { View, ViewsContext, fetchViews } from './resources';

//import config
import { Config } from './providers/configProvider';
import { buildAuthProvider } from './providers/authProvider';
import crPostgres from './resources/cr.postgres.db.movetokube.com';
import crPostgresUsers from './resources/cr.postgresusers.db.movetokube.com';
import crNuclioApiGateways from './resources/cr.nuclioapigateways.nuclio.io';
import { httpClientProvider } from './providers/httpClientProvider';

console.log('Config', Config);

//build providers
const authProvider = buildAuthProvider(Config);

//build http client for provider
const httpClient = httpClientProvider(authProvider);
const dataProvider = appDataProvider(Config.application.apiUrl, httpClient);
const store = localStorageStore();

const customViews: { [index: string]: View } = {
    'postgres.db.movetokube.com': crPostgres,
    'postgresusers.db.movetokube.com': crPostgresUsers,
    'nuclioapigateways.nuclio.io': crNuclioApiGateways,
};

//theming
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
        <BrowserRouter basename={Config.application.contextPath}>
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
    const [views, setViews] = useState<View[]>([]);
    const { crdIds } = useUpdateCrdIds();

    const viewsContext = useContext(ViewsContext);

    if (crdIds.length === 0 && views.length > 0) {
        setViews([]);
    } else {
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
    }

    return (
        <AdminUI
            ready={Loading}
            dashboard={MyDashboard}
            loginPage={Login}
            layout={MyLayout}
            requireAuth={true}
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
