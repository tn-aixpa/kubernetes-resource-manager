import englishMessages from 'ra-language-english';

// add translations for all custom texts
// translations for default texts (create, delete, etc.) will be imported from a separate repo
const messages = {
    ...englishMessages,
    resources: {
        crs: {
            name: 'Impostazioni',
            fields: {
                version: 'Versione',
            },
        },
    },
    pages: {
        schema: {
            list: {
                title: 'Impostazioni',
                subtitle:
                    'Aggiungere uno schema per abilitare la gestione delle CR corrispondenti.',
            },
            create: {
                title: 'Crea schema',
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
                title: 'Crea ',
            },
            edit: {
                title: 'Modifica ',
            },
            show: {
                title: 'Visualizza ',
            },
        },
    },
};

export default messages;
