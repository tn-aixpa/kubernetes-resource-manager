import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    ShowButton,
    SimpleForm,
    TextField,
    TextInput,
    Show,
    SimpleShowLayout,
    ReferenceInput,
    AutocompleteInput,
    required,
    FormDataConsumer,
    DeleteWithConfirmButton,
    useGetOne,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { CrdProps } from '../components/CrdProps';
import { DeleteConfirmToolbar } from '../components/DeleteConfirmToolbar';
import { useUpdateCrdIds } from '../hooks/useUpdateCrdIds';
import { Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

export const SchemaList = () => {
    const notify = useNotify();

    const { updateCrdIds } = useUpdateCrdIds();

    const onSuccess = (data: any) => {
        updateCrdIds();
        notify('ra.notification.deleted', { messageArgs: { smart_count: 1 } });
    };
    // TODO schema -> copy button with import TextSnippetIcon from '@mui/icons-material/TextSnippet';
    // TODO All cards should have a title (Create schema, etc.)
    return (
        <>
            <Typography variant="h4" className="login-page-title">
                Settings
            </Typography>
            <Typography variant="subtitle1" className="login-page-title">
                Please add a schema to enable CR management.
            </Typography>
            <List>
                <Datagrid bulkActionButtons={false}>
                    <TextField source="crdId" label="CRD" />
                    <TextField source="version" />
                    <TextField source="schema" />
                    <EditButton />
                    <ShowButton />
                    <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />
                </Datagrid>
            </List>
        </>
    );
};

export const SchemaEdit = () => (
    <Edit>
        <SimpleForm toolbar={<DeleteConfirmToolbar />}>
            <TextInput source="id" disabled sx={{ width: '22em' }} />
            <TextInput
                source="crdId"
                label="CRD"
                disabled
                sx={{ width: '22em' }}
            />
            <TextInput source="version" disabled />
            <TextInput source="schema" fullWidth />
        </SimpleForm>
    </Edit>
);

export const SchemaCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const { updateCrdIds } = useUpdateCrdIds();

    const onSuccess = (data: any) => {
        updateCrdIds();
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('edit', resource, data.id, data);
    };

    const params = new URLSearchParams(window.location.search);
    const crdIdFromQuery = params.get('crdId');
    // TODO param in backend to filter out CRDs that already have a schema for the stored version
    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <ReferenceInput source="crdId" reference="crd">
                    <AutocompleteInput
                        label="CRD"
                        validate={required()}
                        sx={{ width: '22em' }}
                        defaultValue={
                            crdIdFromQuery ? crdIdFromQuery : undefined
                        }
                    />
                </ReferenceInput>
                <FormDataConsumer>
                    {({ formData, ...rest }) =>
                        formData.crdId ? (
                            <SchemaVersionInput
                                crdId={formData.crdId}
                                {...rest}
                            />
                        ) : (
                            <TextInput
                                source="version"
                                helperText="Please select a CRD"
                                disabled
                            />
                        )
                    }
                </FormDataConsumer>
                <TextInput source="schema" fullWidth />
            </SimpleForm>
        </Create>
    );
};

export const SchemaShow = () => (
    //TODO aggiungere collegamento per cliccare sul crd id e aprire la crd
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="crdId" label="CRD" />
            <TextField source="version" />
            <TextField source="schema" />
        </SimpleShowLayout>
    </Show>
);

// TODO custom field with useFormContext
const SchemaVersionInput = ({ crdId }: CrdProps) => {
    const { setValue } = useFormContext(); // retrieve all hook methods
    const { data } = useGetOne('crd', { id: crdId });
    useEffect(() => {
        const storedVersion = data.spec.versions.filter(
            (version: any) => version.storage
        )[0];
        setValue('version', storedVersion.name);
    }, [data, data.spec.versions, setValue]);

    return <TextInput source="version" disabled />;
};
