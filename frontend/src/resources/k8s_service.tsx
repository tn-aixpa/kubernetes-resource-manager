import React from 'react';
import {
    Datagrid,
    List,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    useShowController,
    useTranslate,
} from 'react-admin';
import { Typography } from '@mui/material';
import { Breadcrumb } from '@dslab/ra-breadcrumb';

export const K8SServiceList = () => (
    <>
        <Breadcrumb />
        <List actions={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField source="metadata.name" />
                <TextField source="spec.ports[0].name" />
                <TextField source="spec.ports[0].port" />
                <ShowButton />
            </Datagrid>
        </List>
    </>
);

export const K8SServiceShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.show', {
                    name: 'Service',
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Show actions={false}>
                <SimpleShowLayout>
                    <TextField source="metadata.name" />
                    <TextField source="metadata.creationTimestamp" />
                    <TextField source="metadata.resourceVersion" />
                    <TextField source="spec.ports[0].name" />
                    <TextField source="spec.ports[0].port" />

                </SimpleShowLayout>
            </Show>
        </>
    );
};

