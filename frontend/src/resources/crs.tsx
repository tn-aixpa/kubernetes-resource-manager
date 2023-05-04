import { Datagrid, List, TextField } from "react-admin";

export const SchemaList = () => (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="crdId" />
        <TextField source="version" />
        <TextField source="schema" />
      </Datagrid>
    </List>
  );