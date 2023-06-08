import React from 'react';
import {
    Button,
    Datagrid,
    List,
    Loading,
    NumberField,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    useGetManyReference,
    useShowController,
    useTranslate,
} from 'react-admin';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Typography } from '@mui/material';
import { AceEditorField } from '@smartcommunitylab/ra-ace-editor';
import Breadcrumb from '../components/Breadcrumb';

export const CrdList = () => (
    <>
        <Breadcrumb />
        <List actions={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField source="spec.names.kind" />
                <ShowButton />
            </Datagrid>
        </List>
    </>
);

export const CrdShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.show', {
                    name: 'CRD',
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Show actions={false}>
                <SimpleShowLayout>
                    <TextField source="metadata.creationTimestamp" />
                    <NumberField source="metadata.generation" />
                    <TextField source="metadata.name" />
                    <TextField source="metadata.resourceVersion" />
                    <TextField source="metadata.uid" />
                    <AceEditorField
                        mode="json"
                        record={{
                            managedFields: JSON.stringify(
                                record.metadata.managedFields
                            ),
                        }}
                        source="managedFields"
                    />
                    <RelatedResources />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const RelatedResources = () => {
    const translate = useTranslate();
    const { record } = useShowController();

    const sort = { field: 'id', order: 'ASC' };
    const { data, total, isLoading } = useGetManyReference('crs', {
        target: 'crdId',
        id: record.id,
        pagination: { page: 1, perPage: 10 },
        sort: sort,
    });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return total ? (
        <>
            <Typography variant="h6">
                {translate('resources.crs.schemas')}
            </Typography>
            <Datagrid
                data={data}
                total={total}
                isLoading={isLoading}
                bulkActionButtons={false}
                sort={sort}
            >
                <TextField source="id" label={'resources.crs.fields.id'} />
                <TextField
                    source="version"
                    label={'resources.crs.fields.version'}
                />
                <ShowButton resource="crs" />
            </Datagrid>
            <Button
                label={'buttons.listCrs'}
                startIcon={<VisibilityIcon />}
                href={`${window.location.origin}/${record.id}`}
            ></Button>
        </>
    ) : (
        <Button
            label={translate('ra.page.create', {
                name: translate('resources.crs.name', { smart_count: 1 }),
            })}
            href={`${window.location.origin}/crs/create?crdId=${record.id}`}
        ></Button>
    );
};
