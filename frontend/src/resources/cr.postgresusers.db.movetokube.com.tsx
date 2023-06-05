import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
    Show,
    SimpleShowLayout,
    DeleteWithConfirmButton,
    Create,
    SimpleForm,
    TextInput,
    useResourceContext,
    required,
    Edit,
    useEditController,
    useShowController,
} from 'react-admin';
import { View } from './index';
import { ViewToolbar } from '../components/ViewToolbar';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { ApiVersionInput, KindInput, SimplePageTitle } from './cr';

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
                    {crdId && (
                        <ApiVersionInput
                            crdId={crdId}
                            sx={{ display: 'none' }}
                        />
                    )}
                    {crdId && (
                        <KindInput crdId={crdId} sx={{ display: 'none' }} />
                    )}
                    <TextInput source="metadata.name" validate={required()} />
                    <TextInput source="spec.database" validate={required()} />
                    <TextInput source="spec.privileges" validate={required()} />
                    <TextInput source="spec.role" validate={required()} />
                    <TextInput source="spec.secretName" validate={required()} />
                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const { record } = useEditController();
    if (!record) return null;

    return (
        <>
            <SimplePageTitle
                pageType="edit"
                crName="postgresusers.db.movetokube.com.names.singular"
                crId={record.spec.role}
            />
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<ViewToolbar />}>
                    <TextInput source="spec.database" validate={required()} />
                    <TextInput source="spec.privileges" validate={required()} />
                    <TextInput source="spec.role" validate={required()} />
                    <TextInput source="spec.secretName" validate={required()} />
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
                    <TextField source="apiVersion" />
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
    if (!record) return null;

    return (
        <>
            <SimplePageTitle
                pageType="show"
                crName="postgresusers.db.movetokube.com.names.singular"
                crId={record.spec.role}
            />
            <Show actions={<ShowTopToolbar />}>
                <SimpleShowLayout>
                    <TextField source="spec.database" />
                    <TextField source="spec.privileges" />
                    <TextField source="spec.role" />
                    <TextField source="spec.secretName" />
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
