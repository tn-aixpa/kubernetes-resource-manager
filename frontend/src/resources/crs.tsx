// SPDX-License-Identifier: Apache-2.0
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
    Button,
    ReferenceField,
    useShowController,
    useEditController,
    usePermissions,
} from 'react-admin';
import { useUpdateCrdIds } from '../hooks/useUpdateCrdIds';
import { Box, Typography } from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { ViewToolbar } from '../components/ViewToolbar';
import {
    AceEditorField,
    AceEditorInput,
} from '@dslab/ra-ace-editor';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { Breadcrumb } from '@dslab/ra-breadcrumb';

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

    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.create', {
                    name: translate('resources.crs.name', {
                        smart_count: 1,
                    }).toLowerCase(),
                })}
            </Typography>
            <Create
                mutationOptions={{ onSuccess }}
                actions={<CreateTopToolbar />}
            >
                <SimpleForm>
                    <ReferenceInput
                        source="crdId"
                        reference="crd"
                        filter={{ onlyWithoutSchema: true }}
                        perPage={1000}
                    >
                        <AutocompleteInput
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
                                    helperText={translate(
                                        'resources.crs.createVersionHelp'
                                    )}
                                    disabled
                                />
                            )
                        }
                    </FormDataConsumer>
                    <AceEditorInput
                        mode="json"
                        source="schema"
                        theme="monokai"
                        fullWidth={true}
                    />
                </SimpleForm>
            </Create>
        </>
    );
};

export const SchemaEdit = () => {
    const translate = useTranslate();
    const { record } = useEditController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.edit', {
                    name: translate('resources.crs.name', { smart_count: 1 }),
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Edit actions={<EditTopToolbar />} mutationMode='pessimistic'>
                <SimpleForm toolbar={<ViewToolbar />}>
                    <TextInput source="id" disabled sx={{ width: '22em' }} />
                    <TextInput source="crdId" disabled sx={{ width: '22em' }} />
                    <TextInput source="version" disabled />
                    <AceEditorInput
                        mode="json"
                        source="schema"
                        theme="monokai"
                        fullWidth={true}
                    />
                </SimpleForm>
            </Edit>
        </>
    );
};

export const SchemaList = () => {
    const notify = useNotify();
    const translate = useTranslate();
    const { permissions } = usePermissions();
    const canAccess = (op: string) => permissions && permissions.canAccess('crs', op)

    const { updateCrdIds } = useUpdateCrdIds();

    const onSuccess = (data: any) => {
        updateCrdIds();
        notify('ra.notification.deleted', { messageArgs: { smart_count: 1 } });
    };

    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('resources.crs.name', { smart_count: 2 })}
            </Typography>
            <Typography variant="subtitle1" sx={{ padding: '0px' }}>
                {translate('resources.crs.listSubtitle')}
            </Typography>
            <List actions={<ListTopToolbar hasCreate={canAccess('write')} />}>
                <Datagrid bulkActionButtons={false}>
                    <TextField source="crdId" />
                    <TextField source="version" />
                    <Box textAlign={'right'}>
                        <CopyButton />
                        { canAccess('write') && <EditButton /> }
                        { canAccess('read') && <ShowButton /> }
                        { canAccess('write') && <DeleteWithConfirmButton mutationOptions={{ onSuccess }} /> }
                    </Box>
                </Datagrid>
            </List>
        </>
    );
};

export const SchemaShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    const { permissions } = usePermissions();
    const canAccess = (op: string) => permissions && permissions.canAccess('crs', op)

    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.show', {
                    name: translate('resources.crs.name', { smart_count: 1 }),
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Show actions={<ShowTopToolbar hasEdit={canAccess('write')} hasDelete={canAccess('write')}/>}>
                <SimpleShowLayout>
                    <TextField source="id" />
                    <ReferenceField
                        source="crdId"
                        reference="crd"
                        link={(crd, reference) =>
                            `/${reference}/${crd.id}/show?schema=${record.id}`
                        }
                    />

                    <TextField source="version" />
                    <AceEditorField mode="json" 
                    source="schema" 
                    record={{
                        schema: JSON.stringify(
                            record.schema
                        ),
                    }}/>
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const SchemaVersionInput = ({ crdId }: { crdId: string }) => {
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

const CopyButton = () => {
    const { schema } = useRecordContext();

    return (
        <Button
            label={'buttons.copy'}
            startIcon={<TextSnippetIcon />}
            onClick={() => navigator.clipboard.writeText(schema)}
        />
    );
};
