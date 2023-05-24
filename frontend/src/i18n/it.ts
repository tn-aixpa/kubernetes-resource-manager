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
                title: "Impostazioni",
                subtitle: "Aggiungere uno schema per abilitare la gestione delle CR corrispondenti."
            },
            create: {
                title: "Crea schema"
            },
        },
        cr: {

        }
    }
};

export default messages;