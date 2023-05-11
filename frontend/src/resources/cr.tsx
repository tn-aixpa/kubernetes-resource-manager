import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    ShowButton,
    SimpleForm,
    TextField,
    TextInput,
    Show,
    SimpleShowLayout,
    required,
} from 'react-admin';
import { parse, format } from '../utils';
import { ApiVersionInput, KindInput } from '../components/inputs';

export const CrList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="apiVersion" />
            <TextField source="kind" />
            <EditButton />
            <ShowButton />
        </Datagrid>
    </List>
);

export const CrEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="apiVersion" disabled />
            <TextInput source="kind" disabled />
            <TextInput source="metadata.name" disabled />
            <TextInput
                source="spec"
                fullWidth
                multiline
                parse={parse}
                format={format}
            />
        </SimpleForm>
    </Edit>
);

export const CrCreate = () => (
    <Create>
        <SimpleForm>
            <ApiVersionInput sx={{ width: '22em' }} disabled />
            <KindInput disabled />
            {/* <ReferenceInput source="kind" reference="crd" filter={{ id: useResourceContext() }} >
                <PrecompiledInput />
            </ReferenceInput> */}
            <TextInput source="metadata.name" validate={required()} />
            <TextInput
                source="spec"
                fullWidth
                multiline
                parse={parse}
                format={format}
            />
        </SimpleForm>
    </Create>
);

export const CrShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="apiVersion" />
            <TextField source="kind" />
            <TextField source="metadata" />
            <TextField source="spec" />
        </SimpleShowLayout>
    </Show>
);
