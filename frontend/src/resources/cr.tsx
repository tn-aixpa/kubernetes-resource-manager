// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
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
    required,
    useResourceContext,
    useGetOne,
    Loading,
    DeleteWithConfirmButton,
    useTranslate,
    useShowController,
    useEditController,
    usePermissions,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { ViewToolbar } from '../components/ViewToolbar';

import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { useCrTransform } from '../hooks/useCrTransform';
import { Breadcrumb } from '@dslab/ra-breadcrumb';
import { JsonSchemaInput, JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { useGetCrdJsonSchema } from '../hooks/useGetCrdJsonSchema';

export const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const { jsonSchema } = useGetCrdJsonSchema();
    const translate = useTranslate();

    const transform = (data: any) => {
        return {
            ...data,
            apiVersion: apiVersion,
            kind: kind,
        };
    };

    const validate = (values: any) => {
        if (!apiVersion || !kind) {
            return {
                apiVersion: translate('resources.cr.transformError'),
                kind: translate('resources.cr.transformError'),
            };
        }

        return {};
    };

    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="create" />
            <Create
                redirect="list"
                actions={<CreateTopToolbar />}
                transform={transform}
            >
                <SimpleForm validate={validate}>
                    <TextInput
                        source="metadata.name"
                        validate={required()}
                        label={'resources.cr.fields.metadata.name'}
                    />

                    {jsonSchema ? (
                        <JsonSchemaInput
                            source="spec"
                            schema={jsonSchema}
                        />
                    ) : null}
                </SimpleForm>
            </Create>
        </>
    );
};

export const CrEdit = () => {
    const { jsonSchema } = useGetCrdJsonSchema();
    const { record } = useEditController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="edit" crId={record.id} />
            <Edit actions={<EditTopToolbar hasYaml />} mutationMode='pessimistic'>
                <SimpleForm toolbar={<ViewToolbar />}>
                    {jsonSchema ? (
                        <JsonSchemaInput
                            source="spec"
                            schema={jsonSchema}
                        />
                    ) : null}
                    
                </SimpleForm>
            </Edit>
        </>
    );
};

export const CrList = () => {
    const crdId = useResourceContext();

    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(crdId, op)

    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="list" />
            <List actions={<ListTopToolbar hasCreate={hasPermission('write')} />}>
                <Datagrid>
                    <TextField source="id" label={'resources.cr.fields.id'} />
                    <TextField
                        source="apiVersion"
                        label={'resources.cr.fields.apiVersion'}
                    />
                    <TextField
                        source="kind"
                        label={'resources.cr.fields.kind'}
                    />
                    <Box textAlign={'right'}>
                        {hasPermission('write') && <EditButton />}
                        {hasPermission('read') && <ShowButton />}
                        {hasPermission('write') && <DeleteWithConfirmButton />}
                    </Box>
                </Datagrid>
            </List>
        </>
    );
};

export const CrShow = () => {
    const { jsonSchema } = useGetCrdJsonSchema();
    const { record } = useShowController();
    const crdId = useResourceContext();

    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(crdId, op)

    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="show" crId={record.id} />
            <Show actions={<ShowTopToolbar hasYaml hasDelete={hasPermission('write')} hasEdit={hasPermission('write')} />}>
                <SimpleShowLayout>
                    <TextField source="id" label={'resources.cr.fields.id'} />
                    <TextField
                        source="apiVersion"
                        label={'resources.cr.fields.apiVersion'}
                    />
                    <TextField
                        source="kind"
                        label={'resources.cr.fields.kind'}
                    />
                    {jsonSchema ? (
                        <JsonSchemaField
                            source="spec"
                            schema={jsonSchema}
                        />
                    ) : null}

                </SimpleShowLayout>
            </Show>
        </>
    );
};

const PageTitle = ({ pageType, crId }: { pageType: string; crId?: string }) => {
    const crdId = useResourceContext();
    const translate = useTranslate();

    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;

    return (
        <Typography variant="h4" className="page-title">
            {translate(`ra.page.${pageType}`, {
                name: data.spec.names.kind,
                recordRepresentation: crId,
            })}
        </Typography>
    );
};

export const SimplePageTitle = ({
    pageType,
    crName,
    crId = '',
}: {
    pageType: string;
    crName: string;
    crId?: string;
}) => {
    const translate = useTranslate();

    const smartCount = pageType === 'list' ? 2 : 1;
    const name = translate(`resources.${crName}.name`, {
        smart_count: smartCount,
    });

    return (
        <Typography variant="h4" className="page-title">
            {translate(`ra.page.${pageType}`, {
                name: name,
                recordRepresentation: crId,
            })}
        </Typography>
    );
};
