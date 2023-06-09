import englishMessages from 'ra-language-english';

const messages = {
    ...englishMessages,
    login: {
        basicMessage: 'Please log in to continue',
        title: 'Resource Manager',
        message: 'Log in with AAC',
    },
    resources: {
        crs: {
            name: 'Schema |||| Settings',
            schemas: 'Schemas',
            fields: {
                id: 'ID',
                crdId: 'CRD',
                version: 'Version',
                schema: 'Schema',
            },
            listSubtitle: 'Please add a schema to enable CR management.',
            createVersionHelp: 'Please select a CRD',
        },
        crd: {
            name: 'CRD |||| CRDs',
            fields: {
                metadata: {
                    creationTimestamp: 'Created',
                    generation: 'Generation',
                    name: 'Name',
                    resourceVersion: 'Resource version',
                    uid: 'UID',
                },
                managedFields: 'Managed fields',
            },
        },
        cr: {
            fields: {
                id: 'ID',
                apiVersion: 'API Version',
                kind: 'Kind',
                metadata: 'Metadata',
                'metadata.name': 'Name',
                spec: 'Specification',
            },
            transformError: 'Required values are missing.',
        },
        'postgres.db.movetokube.com': {
            name: 'Postgres DB |||| Postgres DBs',
            fields: {
                id: 'ID',
                spec: {
                    database: 'Database',
                    dropOnDelete: 'Drop on delete',
                    extensions: 'Extensions',
                    masterRole: 'Master role',
                    schemas: 'Schemas',
                },
            },
        },
        'postgresusers.db.movetokube.com': {
            name: 'Postgres user |||| Postgres users',
            shortName: 'Users',
            fields: {
                id: 'ID',
                spec: {
                    database: 'Database ID',
                    privileges: 'Privileges',
                    role: 'Role',
                    secretName: 'Secret name',
                },
            },
        },
        'nuclioapigateways.nuclio.io': {
            name: 'Nuclio API Gateway |||| Nuclio API Gateways',
            fields: {
                id: 'ID',
                spec: {
                    'authentication.basicAuth': {
                        username: 'Username',
                        password: 'Password',
                    },
                    authenticationMode: 'Authentication mode',
                    host: 'Host',
                    name: 'Name',
                    description: 'Description',
                    path: 'Path',
                    upstreams: 'Upstreams',
                    'upstreams.kind': 'Kind',
                    'upstreams.nucliofunction.name': 'Nuclio function name',
                },
            },
        },
    },
    dashboard: {
        title: 'Resource Manager',
        message: 'Welcome to the Resource Manager.',
    },
    buttons: {
        copy: 'Copy',
        listCrs: 'List custom resources',
        createUser: 'Add user',
    },
};

export default messages;
