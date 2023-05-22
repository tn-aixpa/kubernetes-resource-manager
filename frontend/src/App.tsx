import React, { useContext, useState } from 'react';
import './App.css';
import appDataProvider from './dataProvider';
import { BrowserRouter } from 'react-router-dom';
import {
    AdminContext,
    AdminUI,
    Loading,
    Resource,
    defaultI18nProvider,
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
import { View, ViewsContext, fetchViews } from './resources';
import authenticationProvider from './authProvider';
import { SSOLogin } from './components/SSOLogin';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useUpdateCrdIds } from './hooks/useUpdateCrdIds';

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

const theme = {
    ...defaultTheme,
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
                i18nProvider={defaultI18nProvider}
                store={store}
                theme={theme}
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
    (async () => {
        for (const crdId of crdIds) {
            try {
                const crModule = await import('./resources/cr.' + crdId);
                const crView = crModule.default;

                if (!viewsContext.list().some(v => v.key === crdId)) {
                    viewsContext.put(crView);
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
    })();

    return (
        <AdminUI ready={Loading} loginPage={SSOLogin} requireAuth>
            <Resource
                name="crs"
                list={SchemaList}
                edit={SchemaEdit}
                create={SchemaCreate}
                show={SchemaShow}
                options={{ label: 'Schemas' }}
            />
            <Resource
                name="crd"
                list={CrdList}
                show={CrdShow}
                options={{ label: 'CRDs' }}
                recordRepresentation="id"
            />
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
        </AdminUI>
    );
}

export default App;
