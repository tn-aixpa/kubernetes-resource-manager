import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
    Show,
    SimpleShowLayout,
    DeleteWithConfirmButton,
    useShowController,
    Create,
    SimpleForm,
    TextInput,
    useResourceContext,
    required,
    Edit,
} from 'react-admin';
import { View } from './index';
import { Typography, Card } from '@mui/material';
import ListTopToolbar from '../components/top-toolbars/ListTopToolbar';
import { AceEditorField } from '@smartcommunitylab/ra-ace-editor';
import ApiVersionInput from "../components/inputs/ApiVersionInput";
import KindInput from "../components/inputs/KindInput";
import EditTopToolbar from '../components/top-toolbars/EditTopToolbar';
import { SaveToolbar } from '../components/SaveToolbar';
import ShowTopToolbar from '../components/top-toolbars/ShowTopToolbar';
import CreateTopToolbar from '../components/top-toolbars/CreateTopToolbar';

export const CrCreate = () => {
    const crdId = useResourceContext();

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {'Create Postgres user'}
            </Typography>
            <Create redirect="list" actions={<CreateTopToolbar />}>
                <SimpleForm>
                    {crdId && <ApiVersionInput crdId={crdId} />}
                    {crdId && <KindInput crdId={crdId} />}
                    <TextInput source="metadata.name" validate={required()} />
                    <Card sx={{ padding: '20px' }}>
                        <Typography variant="h6">Specification</Typography>
                        <TextInput
                            className="inline-field"
                            source="spec.database"
                            validate={required()}
                            label="Database"
                        />
                        <TextInput
                            className="inline-field"
                            source="spec.privileges"
                            validate={required()}
                            label="Privileges"
                        />
                        <TextInput
                            className="inline-field"
                            source="spec.role"
                            validate={required()}
                            label="Role"
                        />
                        <TextInput
                            className="inline-field"
                            source="spec.secretName"
                            validate={required()}
                            label="Secret name"
                        />
                    </Card>
                </SimpleForm>
            </Create>
        </>
    );
};

export const CrEdit = () => {
    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {'Edit Postgres user'}
            </Typography>
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<SaveToolbar />}>
                    <TextInput source="apiVersion" disabled />
                    <TextInput source="kind" disabled />
                    <TextInput source="metadata.name" disabled />
                    <Card sx={{ padding: '20px' }}>
                        <Typography variant="h6">Specification</Typography>
                        <TextInput
                            className="inline-field"
                            source="spec.database"
                            validate={required()}
                            label="Database"
                        />
                        <TextInput
                            className="inline-field"
                            source="spec.privileges"
                            validate={required()}
                            label="Privileges"
                        />
                        <TextInput
                            className="inline-field"
                            source="spec.role"
                            validate={required()}
                            label="Role"
                        />
                        <TextInput
                            className="inline-field"
                            source="spec.secretName"
                            validate={required()}
                            label="Secret name"
                        />
                    </Card>
                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {'List Postgres users'}
            </Typography>
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField label="API Version" source="apiVersion" />
                    <TextField source="kind" />
                    <EditButton />
                    <ShowButton />
                    <DeleteWithConfirmButton />
                </Datagrid>
            </List>
        </>
    );
};

const CrShow = () => {
    const { record } = useShowController();

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {'View Postgres DB'}
            </Typography>
            <Show actions={<ShowTopToolbar />}>
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField label="API Version" source="apiVersion" />
                    <TextField source="kind" />
                    <AceEditorField
                        mode="json"
                        record={{
                            metadata: JSON.stringify(record.metadata),
                        }}
                        source="metadata"
                    />
                    <Typography variant="h6">Specification</Typography>
                    <TextField source="spec.database" label="Database" />
                    <TextField source="spec.privileges" label="Privileges" />
                    <TextField source="spec.role" label="Role" />
                    <TextField source="spec.secretName" label="Secret name" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const CustomView: View = {
    key: 'postgresusers.db.movetokube.com',
    name: 'Postgres users',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
};

export default CustomView;
