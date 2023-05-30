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
import { AceEditorField } from '@smartcommunitylab/ra-ace-editor';
import { ViewToolbar } from '../components/ViewToolbar';
import { SimplePageTitle } from '../components/SimplePageTitle';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { ApiVersionInput, KindInput } from './cr';

const CrCreate = () => {
    const crdId = useResourceContext();

    return (
        <>
            <SimplePageTitle
                pageType="create"
                crName="postgresusers.db.movetokube.com.names.singular"
            />
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

const CrEdit = () => {
    return (
        <>
            <SimplePageTitle
                pageType="edit"
                crName="postgresusers.db.movetokube.com.names.singular"
            />
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<ViewToolbar />}>
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
            <SimplePageTitle
                pageType="list"
                crName="postgresusers.db.movetokube.com.names.plural"
            />
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
            <SimplePageTitle
                pageType="show"
                crName="postgresusers.db.movetokube.com.names.singular"
            />
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
