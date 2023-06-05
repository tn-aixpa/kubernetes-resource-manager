import englishMessages from 'ra-language-english';

// translations for default texts (create, delete, etc.) will be imported from a separate repo
const messages = {
    ...englishMessages,
    login: {
        basic_message: 'Autenticarsi per continuare',
        title: 'Resource Manager',
        message: 'Accedi con AAC',
    },
    resources: {
        crs: {
            name: 'Schema |||| Impostazioni',
            fields: {
                id: 'ID',
                crd: 'CRD',
                version: 'Versione',
                schema: 'Schema',
            },
        },
        crd: {
            name: 'CRD',
        },
    },
    dashboard: {
        name: 'Cruscotto',
        title: 'Resource Manager',
        message: 'Benvenuto in Resource Manager.',
    },
    button: {
        list: 'Elenco',
        copy: 'Copia',
    },
    pages: {
        schema: {
            list: {
                title: 'Impostazioni',
                subtitle:
                    'Aggiungere uno schema per abilitare le CR corrispondenti.',
            },
            create: {
                title: 'Crea schema',
                versionHelp: 'Selezionare una CRD',
            },
            edit: {
                title: 'Modifica schema',
            },
            show: {
                title: 'Visualizza schema',
            },
        },
        cr: {
            list: {
                title: '',
            },
            create: {
                title: 'Crea',
            },
            edit: {
                title: 'Modifica',
            },
            show: {
                title: 'Visualizza',
            },
            'postgres.db.movetokube.com': {
                names: {
                    singular: 'DB Postgres',
                    plural: 'DB Postgres',
                },
            },
            'postgresusers.db.movetokube.com': {
                names: {
                    singular: 'Utente Postgres',
                    plural: 'Utenti Postgres',
                },
            },
        },
        crd: {
            show: {
                title: 'Visualizza CRD',
                listCrs: 'Elenco custom resources',
                createSchema: 'Crea schema',
            },
        },
    },
};

export default messages;
