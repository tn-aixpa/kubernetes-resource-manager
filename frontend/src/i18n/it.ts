import italianMessages from '@smartcommunitylab/ra-language-italian';

const messages = {
    ...italianMessages,
    login: {
        basicMessage: 'Autenticarsi per continuare',
        title: 'Resource Manager',
        message: 'Accedi con AAC',
    },
    resources: {
        crs: {
            name: 'Schema |||| Impostazioni',
            schemas: 'Schemi',
            fields: {
                id: 'ID',
                crdId: 'CRD',
                version: 'Versione',
                schema: 'Schema',
            },
            listSubtitle:
                'Aggiungere uno schema per abilitare le CR corrispondenti.',
            createVersionHelp: 'Selezionare una CRD',
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
        cr: {
            fields: {
                id: 'ID',
                apiVersion: 'Versione API',
                kind: 'Tipo',
                metadata: 'Metadata',
                'metadata.name': 'Nome',
                spec: 'Specifiche',
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
            shortName: 'Utenti',
            fields: {
                id: 'ID',
                spec: {
                    database: 'ID Database',
                    privileges: 'Privilegi',
                    role: 'Ruolo',
                    secretName: 'Nome secret',
                },
            },
        },
        'nuclioapigateways.nuclio.io': {
            name: 'Nuclio API Gateway',
            fields: {
                id: 'ID',
                spec: {
                    authentication: {
                        basicAuth: {
                            username: 'Nome utente',
                            password: 'Password',
                        },
                        dexAuth: {
                            oauth2ProxyUrl: 'OAuth2 proxy URL',
                            redirectUnauthorizedToSignIn: 'Reindirizzare al sign in quando non autorizzato'
                        },
                        jwtAuth: {
                            audience: 'Audience'
                        }
                    },
                    authenticationMode: 'Modalità',
                    host: 'Host',
                    name: 'Nome',
                    description: 'Descrizione',
                    path: 'Percorso',
                    upstreams: 'Upstream',
                    'upstreams.kind': 'Tipo',
                    'upstreams.nucliofunction.name': 'Nome funzione Nuclio',
                    'upstreams.service.name': 'Nome servizio',
                },
                status: {
                    state: 'Stato'
                }
            },
            authenticationTitle: 'Autenticazione',
            alreadyExists: 'Esiste già'
        },
    },
    dashboard: {
        title: 'Resource Manager',
        message: 'Benvenuto in Resource Manager.',
    },
    buttons: {
        copy: 'Copia',
        listCrs: 'Elenco custom resources',
        createUser: 'Aggiungi utente',
    },
};

export default messages;
