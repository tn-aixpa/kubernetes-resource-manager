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
            fields: {
                id: 'ID',
                crdId: 'CRD',
                version: 'Version',
                schema: 'Schema',
            },
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
    },
    dashboard: {
        name: 'Dashboard',
        title: 'Resource Manager',
        message: 'Welcome to the Resource Manager.',
    },
    button: {
        list: 'List',
        copy: 'Copy',
    },
    pages: {
        schema: {
            list: {
                title: 'Settings',
                subtitle: 'Please add a schema to enable CR management.',
            },
            create: {
                title: 'Create schema',
                versionHelp: 'Please select a CRD',
            },
            edit: {
                title: 'Edit schema',
            },
            show: {
                title: 'View schema',
            },
        },
        cr: {
            list: {
                title: '',
            },
            create: {
                title: 'Create',
            },
            edit: {
                title: 'Edit',
            },
            show: {
                title: 'View',
            },
            defaultFields: {
                id: 'ID',
                apiVersion: 'API Version',
                kind: 'Kind',
                metadata: 'Metadata',
                metadataName: 'Name',
                spec: 'Specification',
            },
            'postgres.db.movetokube.com': {
                names: {
                    singular: 'Postgres DB',
                    plural: 'Postgres DBs',
                },
                users: {
                    title: 'Users',
                    createButton: 'Add user',
                    fields: {
                        id: 'ID',
                        role: 'Role',
                        privileges: 'Privileges',
                        secretName: 'SecretName',
                    },
                },
            },
            'postgresusers.db.movetokube.com': {
                names: {
                    singular: 'Postgres user',
                    plural: 'Postgres users',
                },
            },
        },
        crd: {
            show: {
                title: 'View CRD',
                listCrs: 'List custom resources',
                createSchema: 'Create schema',
                crs: {
                    title: 'Schemas',
                    fields: {
                        id: 'ID',
                        version: 'Version',
                    },
                },
            },
        },
    },
};

export default messages;
