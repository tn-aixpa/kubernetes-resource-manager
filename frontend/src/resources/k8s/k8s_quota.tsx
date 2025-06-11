// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    List,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    useShowController,
    useTranslate,
    useRecordContext,
    usePermissions,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { Breadcrumb } from '@dslab/ra-breadcrumb';
import { ShowTopToolbar } from '../../components/toolbars';
import { themeOptions } from '../../App';

const resourceCritical = (used: string, limit: string) => {
    const un = parseFloat(used);
    const ul = parseFloat(limit);
    if (isNaN(un) || isNaN(ul)) return false;
    return (un / ul) * 100 > 75;
}

const QuotaPanel = () => {
    const record = useRecordContext();
    const data = record.status ? Object.keys(record.status.hard).map(k => ({resource: k, limit: record.status.hard[k], used: record.status.used[k]})) : [];
    // TODO revise the implementation
    // const rowSx = (record: any) => {
    //     return resourceCritical(record.used, record.limit) ? { backgroundColor: themeOptions.palette.secondary.highlight } : {}
    // }

    return <Datagrid data={data} bulkActionButtons={false} sx={{
            "& .RaDatagrid-headerCell": {
                fontWeight: "bolder",
            },
        }} >
            <TextField source="resource" sortable={false} />
            <TextField source="used" sortable={false} />
            <TextField source="limit" sortable={false} />
        </Datagrid>
}

export const K8SQuotaList = () => {
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess('k8s_quota', op)

    return <>
        <Breadcrumb />
        <List actions={false}>
            <Datagrid bulkActionButtons={false} expand={<QuotaPanel/>} size='medium' header={<></>}>
                <TextField source="metadata.name" sx={{textTransform: 'uppercase'}}/>
                <Box textAlign={'right'}>
                    {hasPermission('read') && <ShowButton />}
                </Box>
            </Datagrid>
        </List>
    </>
};

export const K8SQuotaShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    if (!record) return null;
    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.show', {
                    name: 'Quota',
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Show actions={<ShowTopToolbar hasYaml hasEdit={false} hasDelete={false} /> }>
                <SimpleShowLayout>
                    <TextField source="metadata.name" />
                    
                    <TextField source="metadata.creationTimestamp" />
                    <TextField source="metadata.resourceVersion" />
                    <List actions={false} disableSyncWithLocation={true} title={' '} pagination={false}>
                        <QuotaPanel />
                    </List>
                </SimpleShowLayout>
            </Show>
        </>
    );
};
