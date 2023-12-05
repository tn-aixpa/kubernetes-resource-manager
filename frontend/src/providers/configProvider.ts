import crPostgres from '../resources/cr.postgres.db.movetokube.com';
import crPostgresUsers from '../resources/cr.postgresusers.db.movetokube.com';
import crNuclioApiGateways from '../resources/cr.nuclioapigateways.nuclio.io';
import crPostgrest from '../resources/cr.postgrests.operator.postgrest.org';
import crDremiorest from '../resources/cr.dremiorestservers.operator.dremiorestserver.com';

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

const OAUTH2_REDIRECT_URL = APPLICATION_URL + AUTH_CALLBACK_PATH;
const OAUTH2_AUTHORITY =
    (globalThis as any).REACT_APP_AUTHORITY || process.env.REACT_APP_AUTHORITY;
const OAUTH2_CLIENT_ID =
    (globalThis as any).REACT_APP_CLIENT_ID || process.env.REACT_APP_CLIENT_ID;
const OAUTH2_SCOPE =
    (globalThis as any).REACT_APP_SCOPE || process.env.REACT_APP_SCOPE;

//build full config

export const Config = {
    application: {
        contextPath: CONTEXT_PATH,
        applicationUrl: APPLICATION_URL,
        apiUrl: API_URL,
    },
    authentication: {
        type: AUTH_TYPE,
        basic: {},
        oauth2: {
            authority: OAUTH2_AUTHORITY,
            clientId: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPE,
            redirectUri: OAUTH2_REDIRECT_URL,
        },
    },
    views: {
        'postgres.db.movetokube.com': crPostgres,
        'postgresusers.db.movetokube.com': crPostgresUsers,
        'nuclioapigateways.nuclio.io': crNuclioApiGateways,
        'postgrests.operator.postgrest.org': crPostgrest,
        'dremiorestservers.operator.dremiorestserver.com': crDremiorest
    },
};

export default Config;
