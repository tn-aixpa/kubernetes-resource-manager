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
    BooleanField,
    Create,
    SimpleForm,
    TextInput,
    useResourceContext,
    required,
    BooleanInput,
    Edit,
} from 'react-admin';
import { View } from './index';
import { Typography, Card } from '@mui/material';
import ListTopToolbar from '../components/top-toolbars/ListTopToolbar';
import { AceEditorField } from '@smartcommunitylab/ra-ace-editor';
import ApiVersionInput from "../components/inputs/ApiVersionInput";
import KindInput from "../components/inputs/KindInput";
import { formatArray, parseArray } from '../utils';
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
                {'Create Postgres DB'}
            </Typography>
            <Create redirect="list" actions={<CreateTopToolbar />}>
                <SimpleForm>
                    {crdId && <ApiVersionInput crdId={crdId} />}
                    {crdId && <KindInput crdId={crdId} />}
                    <TextInput source="metadata.name" validate={required()} />
                    <Card sx={{ padding: '20px' }}>
                        <Typography variant="h6">Specification</Typography>
                        <TextInput
                            source="spec.database"
                            validate={required()}
                            label="Database"
                        />
                        <BooleanInput
                            source="spec.dropOnDelete"
                            label="Drop on delete"
                        />
                        <TextInput
                            fullWidth
                            source="spec.extensions"
                            label="Comma-separated list of extensions"
                            format={formatArray}
                            parse={parseArray}
                        />
                        <TextInput
                            source="spec.masterRole"
                            label="Master role"
                        />
                        <TextInput
                            fullWidth
                            source="spec.schemas"
                            label="Comma-separated list of schemas"
                            format={formatArray}
                            parse={parseArray}
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
                {'Edit Postgres DB'}
            </Typography>
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<SaveToolbar />}>
                    <TextInput source="apiVersion" disabled />
                    <TextInput source="kind" disabled />
                    <TextInput source="metadata.name" disabled />
                    <Card sx={{ padding: '20px' }}>
                        <Typography variant="h6">Specification</Typography>
                        <TextInput
                            source="spec.database"
                            validate={required()}
                            label="Database"
                        />
                        <BooleanInput
                            source="spec.dropOnDelete"
                            label="Drop on delete"
                        />
                        <TextInput
                            fullWidth
                            source="spec.extensions"
                            label="Comma-separated list of extensions"
                            format={formatArray}
                            parse={parseArray}
                        />
                        <TextInput
                            source="spec.masterRole"
                            label="Master role"
                        />
                        <TextInput
                            fullWidth
                            source="spec.schemas"
                            label="Comma-separated list of schemas"
                            format={formatArray}
                            parse={parseArray}
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
                {'Postgres databases'}
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
                    <BooleanField
                        source="spec.dropOnDelete"
                        label="Drop on delete"
                    />
                    <TextField source="spec.extensions" label="Extensions" />
                    <TextField source="spec.masterRole" label="Master role" />
                    <TextField source="spec.schemas" label="Schema" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const CustomView: View = {
    key: 'postgres.db.movetokube.com',
    name: 'Postgres',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
};

export default CustomView;
