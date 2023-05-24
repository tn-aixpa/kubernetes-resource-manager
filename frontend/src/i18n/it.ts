import englishMessages from 'ra-language-english';

// add translations for all custom texts
// translations for default texts (create, delete, etc.) will be imported from a separate repo
const messages = {
    ...englishMessages,
    resources: {
        crs: {
            name: 'Schema |||| Schemi',
            fields: {
                version: 'Versione',
            },
        },
    },
};

export default messages;