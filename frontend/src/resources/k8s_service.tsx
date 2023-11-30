import {
    Datagrid,
    List,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    ArrayField,
    ChipField,
    useShowController,
    useTranslate,
    useRecordContext,
} from 'react-admin';
import { Typography } from '@mui/material';
import { Breadcrumb } from '@dslab/ra-breadcrumb';

// customization to distinguish known types
const labels2type = (labels: any) => {
    if (!labels) return '';
    if (labels['com.coder.resource']) return labels['app.kubernetes.io/name'];
    if (labels['nuclio.io/class']) return 'nuclio';
    return '';
}

const TypeField = (props: any) => {
    const record = useRecordContext(props);
    const type = labels2type(record.metadata.labels);
    return type ? (
        <>
         <ChipField source="type" record={{
            type: type
        }} />
        </>    
    ) : (<></>)
};
    
export const K8SServiceList = () => (
    <>
        <Breadcrumb />
        <List actions={false}>
            <Datagrid bulkActionButtons={false}>
                <TextField source="metadata.name" />
                <TypeField label="resources.k8s_service.fields.type"/>
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
    const type = labels2type(record.metadata.labels);
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
                    {type ? (
                        <ChipField label="resources.k8s_service.fields.type" source="type" record={{
                            type: type
                        }}/>
                    ) : (<></>)}
                    <TextField source="metadata.creationTimestamp" />
                    <TextField source="metadata.resourceVersion" />
                    <TextField source="spec.ports[0].name" />
                    <TextField source="spec.ports[0].port" />
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

