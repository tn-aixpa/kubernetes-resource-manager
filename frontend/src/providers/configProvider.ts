import crPostgres from '../resources/custom/cr.postgres.db.movetokube.com';
import crPostgresUsers from '../resources/custom/cr.postgresusers.db.movetokube.com';
import crPostgrest from '../resources/custom/cr.postgrests.operator.postgrest.org';
import crDremiorest from '../resources/custom/cr.dremiorestservers.operator.dremiorestserver.com';
import crApiGateways from '../resources/custom/cr.apigws.operator.scc-digitalhub.github.io';

import crMinioBuckets from '../resources/custom/cr.buckets.minio.scc-digitalhub.github.io';
import crMinioUsers from '../resources/custom/cr.users.minio.scc-digitalhub.github.io';
import crMinioPolicies from '../resources/custom/cr.policies.minio.scc-digitalhub.github.io';


//read config from ENV
const CONTEXT_PATH =
    (globalThis as any).REACT_APP_CONTEXT_PATH ||
    (process.env.REACT_APP_CONTEXT_PATH as string);
const API_URL: string =
    (globalThis as any).REACT_APP_API_URL ||
    (process.env.REACT_APP_API_URL as string);
const AUTH_CALLBACK_PATH: string = CONTEXT_PATH + (process.env.REACT_APP_AUTH_CALLBACK_PATH as string);

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


const CORE_NAME = (globalThis as any).REACT_APP_CORE_NAME || process.env.REACT_APP_CORE_NAME;
//build full config

export const Config = {
    application: {
        contextPath: CONTEXT_PATH,
        applicationUrl: APPLICATION_URL,
        apiUrl: API_URL,
        coreName: CORE_NAME,
    },
    authentication: {
        type: AUTH_TYPE,
        basic: {},
        oauth2: [
            OAUTH2_AUTHORITY,
            OAUTH2_CLIENT_ID,
            OAUTH2_REDIRECT_URL,
            OAUTH2_SCOPE,
        ],
    },
    views: {
        'postgres.db.movetokube.com': crPostgres,
        'postgresusers.db.movetokube.com': crPostgresUsers,
        'buckets.minio.scc-digitalhub.github.io': crMinioBuckets,
        'users.minio.scc-digitalhub.github.io': crMinioUsers,
        'policies.minio.scc-digitalhub.github.io': crMinioPolicies,
        'postgrests.operator.postgrest.org': crPostgrest,
        'dremiorestservers.operator.dremiorestserver.com': crDremiorest,
        'apigws.operator.scc-digitalhub.github.io': crApiGateways
    },
};

export default Config;
