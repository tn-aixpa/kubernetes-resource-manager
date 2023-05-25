import englishMessages from 'ra-language-english';

const messages = {
    ...englishMessages,
    resources: {
        crs: {
            name: 'Settings',
            fields: {
                version: 'VVVersion',
            },
        },
    },
    pages: {
        schema: {
            list: {
                title: 'Settings',
                subtitle: 'Please add a schema to enable CR management.',
            },
            create: {
                title: 'Create schema',
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
                title: 'Create ',
            },
            edit: {
                title: 'Edit ',
            },
            show: {
                title: 'View ',
            },
        },
    },
};

export default messages;
