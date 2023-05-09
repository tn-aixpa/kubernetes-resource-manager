import { Datagrid, List, Show, ShowButton, SimpleShowLayout, TextField } from "react-admin";

export const CrdList = () => (
    <List>
        <Datagrid bulkActionButtons={false}>
            <TextField source="id" />
            <ShowButton />
        </Datagrid>
    </List>
);

export const CrdShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
        </SimpleShowLayout>
    </Show>
);