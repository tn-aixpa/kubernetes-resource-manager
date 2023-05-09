import { Create, Datagrid, Edit, EditButton, List, ShowButton, SimpleForm, TextField, TextInput, Show, SimpleShowLayout, ReferenceInput } from "react-admin";
import { parse, format } from "../utils";

export const SchemaList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="crdId" />
            <TextField source="version" />
            <TextField source="schema" />
            <EditButton />
            <ShowButton />
        </Datagrid>
    </List>
);

export const SchemaEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="crdId" disabled />
            <TextInput source="version" disabled />
            <TextInput source="schema" fullWidth multiline parse={parse} format={format} />
        </SimpleForm>
    </Edit>
);

export const SchemaCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="crdId" reference="crd" />
            <TextInput source="version" />
            <TextInput source="schema" fullWidth multiline parse={parse} format={format} />
        </SimpleForm>
    </Create>
);

export const SchemaShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="crdId" />
            <TextField source="version" />
            <TextField source="schema" />
        </SimpleShowLayout>
    </Show>
);