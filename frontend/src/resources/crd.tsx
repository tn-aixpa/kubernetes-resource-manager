import { Datagrid, FunctionField, List, ReferenceManyField, Show, ShowButton, SimpleShowLayout, TextField } from "react-admin";

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
            <FunctionField render={(record: any) => JSON.stringify(record)} />
            <ReferenceManyField label="Schemas" reference="crs" target="crdId" >
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="crdId" />
                    <TextField source="version" />
                    <TextField source="schema" />
                    <ShowButton />
                </Datagrid>
            </ReferenceManyField>
        </SimpleShowLayout>
    </Show>
);