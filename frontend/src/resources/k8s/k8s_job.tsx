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
    DeleteButton,
    usePermissions,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { Breadcrumb } from '@dslab/ra-breadcrumb';
import { ShowTopToolbar } from '../../components/toolbars';


const DurationField = (props: any) => {
    const record = useRecordContext(props);
    let duration = '';
    if (record.status && record.status.startTime && record.status.completionTime) {
        const sTime = Date.parse(record.status.startTime);
        const eTime = Date.parse(record.status.completionTime);
        const diff = eTime - sTime;
        // less then a minute: show secs
        if (diff < 60000) {
            duration = Math.floor(diff / 1000) + 's';
        } else if (diff < 3600*1000) {
            duration = Math.floor(diff / 60000) + 'm';
        } else {
            duration = Math.floor(diff / 36000*1000) + 'h';
        }
    }

    return (
        <>
         <TextField source="duration" record={{ duration }} />
        </>    
    )
};

const CompletionField = (props: any) => {
    const record = useRecordContext(props);
    const completed = record.status ? (record.status.succeeded || 0) : 0;
    const running = record.status ? (record.status.running || 0) : 0;
    const failed = record.status ? (record.status.failed || 0) : 0;

    return (
        <>
         <TextField source="completion" record={{
            completion: completed + ' / ' + (completed + running + failed)
        }} />
        </>    
    )
};
    
export const K8SJobList = () => {
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess('k8s_job', op)

    return <>
        <Breadcrumb />
        <List actions={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField source="metadata.name" />
                <CompletionField label="resources.k8s_job.fields.completion"/>
                <DurationField label="resources.k8s_job.fields.duration"/>
                <Box textAlign={'right'}>
                    {hasPermission('read') && <ShowButton />}
                    {hasPermission('write') && <DeleteButton />}
                </Box>
            </Datagrid>
        </List>
    </>
};

export const K8SJobShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess('k8s_job', op)

    if (!record) return null;
    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.show', {
                    name: 'Job',
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Show actions={<ShowTopToolbar hasYaml hasEdit={false} hasDelete={hasPermission('write')} hasLog/> }>
                <SimpleShowLayout>
                    <TextField source="metadata.name" />
                    <CompletionField label="resources.k8s_job.fields.completion"/>
                    <DurationField label="resources.k8s_job.fields.duration"/>
                    <TextField source="metadata.creationTimestamp" />
                    <TextField source="metadata.resourceVersion" />
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

