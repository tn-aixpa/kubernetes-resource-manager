import React from 'react';
import './App.css';
import appDataProvider from './dataProvider';
import { Admin, Resource } from 'react-admin';
import { SchemaList, SchemaEdit, SchemaCreate, SchemaShow } from './resources/crs';
import { CrdList, CrdShow } from './resources/crd';

const API_URL: string = process.env.REACT_APP_API_URL as string;

const dataProvider = appDataProvider(API_URL);

function App() {
    return (
        <Admin dataProvider={dataProvider} disableTelemetry>
            <Resource name="crs" list={SchemaList} edit={SchemaEdit} create={SchemaCreate} show={SchemaShow} options={{ label: 'Schemas' }} />
            <Resource name="crd" list={CrdList} show={CrdShow} options={{ label: 'CRDs' }} recordRepresentation="id" />
        </Admin>
    );
}

export default App;
