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
    useTranslate,
    useRecordContext,
    useShowController,
    Loading,
    Button,
} from 'react-admin';
import { CrdProps } from '../components/CrdProps';
import { useUpdateCrdIds } from '../hooks/useUpdateCrdIds';
import { Typography } from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { SaveToolbar } from '../components/SaveToolbar';
import ListTopToolbar from '../components/top-toolbars/ListTopToolbar';
import ShowTopToolbar from '../components/top-toolbars/ShowTopToolbar';
import EditTopToolbar from '../components/top-toolbars/EditTopToolbar';

export const SchemaList = () => {
    const notify = useNotify();
    const translate = useTranslate();

    const { updateCrdIds } = useUpdateCrdIds();

    const onSuccess = (data: any) => {
        updateCrdIds();
        notify('ra.notification.deleted', { messageArgs: { smart_count: 1 } });
    };

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {translate('pages.schema.list.title')}
            </Typography>
            <Typography
                variant="subtitle1"
                className="login-page-title"
                sx={{ padding: '0px' }}
            >
                {translate('pages.schema.list.subtitle')}
            </Typography>
            <List actions={<ListTopToolbar />}>
                <Datagrid bulkActionButtons={false}>
                    <TextField source="crdId" label="CRD" />
                    <TextField source="version" />
                    <CopyButton />
                    <EditButton />
                    <ShowButton />
                    <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />
                </Datagrid>
            </List>
        </>
    );
};

export const SchemaEdit = () => {
    const translate = useTranslate();
    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {translate('pages.schema.edit.title')}
            </Typography>
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<SaveToolbar />}>
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
        </>
    );
};

export const SchemaCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const { updateCrdIds } = useUpdateCrdIds();
    const translate = useTranslate();

    const onSuccess = (data: any) => {
        updateCrdIds();
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    const params = new URLSearchParams(window.location.search);
    const crdIdFromQuery = params.get('crdId');
    // TODO param in backend to filter out CRDs that already have a schema for the stored version
    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {translate('pages.schema.create.title')}
            </Typography>
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
        </>
    );
};

export const SchemaShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    const crdId = record.crdId;

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {translate('pages.schema.show.title')}
            </Typography>
            <Show actions={<ShowTopToolbar />}>
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="crdId" label="CRD" />
                    <TextField source="version" />
                    <TextField source="schema" />
                </SimpleShowLayout>
            </Show>
            <Typography
                variant="h6"
                className="login-page-title"
                sx={{ padding: '20px 0px 0px 0px' }}
            >
                CRD
            </Typography>
            <Show actions={false}>
                <SimpleShowLayout>
                    <CrdField crdId={crdId} />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const SchemaVersionInput = ({ crdId }: CrdProps) => {
    const { setValue } = useFormContext();
    const { data } = useGetOne('crd', { id: crdId });
    useEffect(() => {
        const storedVersion = data.spec.versions.filter(
            (version: any) => version.storage
        )[0];
        setValue('version', storedVersion.name);
    }, [data, data.spec.versions, setValue]);

    return <TextInput source="version" disabled />;
};

const CrdField = ({ crdId }: CrdProps) => {
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return <>{JSON.stringify(data)}</>;
};

const CopyButton = () => {
    const { schema } = useRecordContext();
    return (
        <Button
            label={'Copy'}
            startIcon={<TextSnippetIcon />}
            onClick={() => navigator.clipboard.writeText(schema)}
        />
    );
};
