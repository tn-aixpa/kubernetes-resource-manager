import React from 'react';
import './App.css';
import simpleRestProvider from 'ra-data-simple-rest';
import { Admin, Resource, fetchUtils } from 'react-admin';
import { SchemaList } from './resources/crs';

const httpClient = function(url:any, options:any) {
  options.user = {
    authenticated: true,
    token: 'Bearer ' + process.env.REACT_APP_TOKEN
  }
  return fetchUtils.fetchJson(url, options);
}

const dataProvider = simpleRestProvider('http://localhost:8080/api', httpClient);

function App() {
  return (
    <Admin dataProvider={dataProvider}>
        <Resource name="crs" list={SchemaList} />
    </Admin>
  );
}

export default App;
