import React from 'react';
import './App.css';
import appDataProvider from './dataProvider';
import { Admin, Resource } from 'react-admin';
import { SchemaList, SchemaEdit, SchemaCreate } from './resources/crs';

const API_URL: string = process.env.REACT_APP_API_URL as string;

const dataProvider = appDataProvider(API_URL);

function App() {
    return (
        <Admin dataProvider={dataProvider}>
            <Resource name="crs" list={SchemaList} edit={SchemaEdit} create={SchemaCreate} options={{ label: 'Schemas' }} />
        </Admin>
    );
}

export default App;
