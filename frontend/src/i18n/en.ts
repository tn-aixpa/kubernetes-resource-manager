import englishMessages from 'ra-language-english';

const messages = {
    ...englishMessages,
    login: {
        basic_message: 'Please log in to continue',
        title: 'Resource Manager',
        message: 'Log in with AAC',
    },
    resources: {
        crs: {
            name: 'Schema |||| Settings',
            fields: {
                id: 'ID',
                crd: 'CRDDDDD',
                version: 'Version',
                schema: 'Schema',
            },
        },
        crd: {
            name: 'CRD |||| CRDs',
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
            'postgres.db.movetokube.com': {
                names: {
                    singular: 'Postgres DB',
                    plural: 'Postgres DBs',
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
            },
        },
    },
};

export default messages;
