import React from 'react';
import {
    Datagrid,
    List,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    ArrayField,
    useShowController,
    useTranslate,
    useRecordContext,
    usePermissions,
    ChipField,
    SingleFieldList,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { Breadcrumb } from '@dslab/ra-breadcrumb';
import { ShowTopToolbar } from '../../components/toolbars';
import { labels2types } from '../../utils';

const StatusField = (props: any) => {
    const record = useRecordContext(props);
    const status = (record.status.readyReplicas || 0) + ' / ' +record.status.replicas;
    return (
         <TextField source="status" record={{
            status: status
        }} />
    )
};

const TypeField = (props: any) => {
    const record = useRecordContext(props);
    const types = labels2types(record.metadata.labels);
    return types ? (
        <ArrayField source="types" record={{ types: types }} >
            <SingleFieldList linkType={false}>
                <ChipField source="name" size="small" />
            </SingleFieldList>
        </ArrayField>
    ) : (<></>)
};

export const K8SDeploymentList = () => {
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess('k8s_deployment', op)

    return <>
        <Breadcrumb />
        <List actions={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField source="metadata.name" />
                <TypeField label="resources.k8s_service.fields.types"/>
                <StatusField  label="resources.k8s_deployment.fields.status"/>
                <Box textAlign={'right'}>
                    {hasPermission('read') && <ShowButton />}
                </Box>
            </Datagrid>
        </List>
    </>
};

export const K8SDeploymentShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    if (!record) return null;
    const types = labels2types(record.metadata.labels);
    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.show', {
                    name: 'Deployment',
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Show actions={<ShowTopToolbar hasYaml hasEdit={false} hasDelete={false} hasLog />}>
                <SimpleShowLayout>
                    <TextField source="metadata.name" />
                    {types ? (
                        <ArrayField source="types" record={{ types: types }} >
                            <SingleFieldList linkType={false}>
                                <ChipField source="name" size="small" />
                            </SingleFieldList>
                        </ArrayField>
                   ) : (<></>)}
                    <TextField source="metadata.creationTimestamp" />
                    <TextField source="metadata.resourceVersion" />
                    <StatusField label="resources.k8s_deployment.fields.status"/>
                    {record.metadata.labels ? (
                        <>
                        <ArrayField source="labels" record={{
                            labels: Object.keys(record.metadata.labels).map(l => ({name: l, value: record.metadata.labels[l]})),
                        }}>
                            <Datagrid bulkActionButtons={false}>
                                <TextField label="label.name" source="name" />
                                <TextField label="label.value" source="value" />
                            </Datagrid>
                        </ArrayField>
                        </>
                    ): (<></>)}
                </SimpleShowLayout>
            </Show>
        </>
    );
};

