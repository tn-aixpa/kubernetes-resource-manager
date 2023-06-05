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
    useEditController,
} from 'react-admin';
import { View } from './index';
import { formatArray, parseArray } from '../utils';
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
                crName="postgres.db.movetokube.com.names.singular"
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
                    <BooleanInput source="spec.dropOnDelete" />
                    <TextInput
                        fullWidth
                        source="spec.extensions"
                        format={formatArray}
                        parse={parseArray}
                    />
                    <TextInput source="spec.masterRole" />
                    <TextInput
                        fullWidth
                        source="spec.schemas"
                        format={formatArray}
                        parse={parseArray}
                    />
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
                crName="postgres.db.movetokube.com.names.singular"
                crId={record.spec.database}
            />
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<ViewToolbar />}>
                    <TextInput source="spec.database" validate={required()} />
                    <BooleanInput source="spec.dropOnDelete" />
                    <TextInput
                        fullWidth
                        source="spec.extensions"
                        format={formatArray}
                        parse={parseArray}
                    />
                    <TextInput source="spec.masterRole" />
                    <TextInput
                        fullWidth
                        source="spec.schemas"
                        format={formatArray}
                        parse={parseArray}
                    />
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
                crName="postgres.db.movetokube.com.names.plural"
            />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.database" />
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
                crName="postgres.db.movetokube.com.names.singular"
                crId={record.spec.database}
            />
            <Show actions={<ShowTopToolbar />}>
                <SimpleShowLayout>
                    <TextField source="spec.database" />
                    <BooleanField source="spec.dropOnDelete" />
                    <TextField source="spec.extensions" />
                    <TextField source="spec.masterRole" />
                    <TextField source="spec.schemas" />
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
