import { Create, Datagrid, Edit, EditButton, List, SimpleForm, TextField, TextInput } from "react-admin";
import { parse, format } from "../utils";

export const SchemaList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="crdId" />
            <TextField source="version" />
            <TextField source="schema" />
            <EditButton />
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
            <TextInput source="crdId" />
            <TextInput source="version" />
            <TextInput source="schema" fullWidth multiline parse={parse} format={format} />
        </SimpleForm>
    </Create>
);