import englishMessages from 'ra-language-english';
// translations for default texts (create, delete, etc.) will be imported from a separate repo
const messages = {
    ...englishMessages,
    login: {
        basicMessage: 'Autenticarsi per continuare',
        title: 'Resource Manager',
        message: 'Accedi con AAC',
    },
    resources: {
        crs: {
            name: 'Schema |||| Impostazioni',
            fields: {
                id: 'ID',
                crdId: 'CRD',
                version: 'Versione',
                schema: 'Schema',
            },
        },
        crd: {
            name: 'CRD',
            fields: {
                metadata: {
                    creationTimestamp: 'Creazione',
                    generation: 'Generazione',
                    name: 'Nome',
                    resourceVersion: 'Versione risorsa',
                    uid: 'UID',
                },
                managedFields: 'Campi gestiti',
            },
        },
        'postgres.db.movetokube.com': {
            name: 'DB Postgres',
            fields: {
                id: 'ID',
                spec: {
                    database: 'Database',
                    dropOnDelete: 'Elimina alla cancellazione',
                    extensions: 'Estensioni',
                    masterRole: 'Ruolo master',
                    schemas: 'Schemi',
                },
            },
        },
        'postgresusers.db.movetokube.com': {
            name: 'Utente Postgres |||| Utenti Postgres',
            fields: {
                id: 'ID',
                spec: {
                    database: 'Database',
                    privileges: 'Privilegi',
                    role: 'Ruolo',
                    secretName: 'Nome secret',
                },
            },
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
            defaultFields: {
                id: 'ID',
                apiVersion: 'Versione API',
                kind: 'Tipo',
                metadata: 'Metadata',
                metadataName: 'Nome',
                spec: 'Specifiche',
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
                crs: {
                    id: 'ID',
                    version: 'Versione',
                },
            },
        },
    },
};

export default messages;
