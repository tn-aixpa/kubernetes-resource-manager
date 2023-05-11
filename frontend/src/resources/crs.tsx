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
    ReferenceInput,
    AutocompleteInput,
    required,
    FormDataConsumer,
} from 'react-admin';
import { SchemaVersionInput } from '../components/inputs';

export const SchemaList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="crdId" label="CRD" />
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
            <TextInput source="id" disabled sx={{ width: '22em' }} />
            <TextInput
                source="crdId"
                label="CRD"
                disabled
                sx={{ width: '22em' }}
            />
            <TextInput source="version" disabled />
            <TextInput source="schema" fullWidth />
        </SimpleForm>
    </Edit>
);

export const SchemaCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="crdId" reference="crd">
                <AutocompleteInput
                    label="CRD"
                    validate={required()}
                    sx={{ width: '22em' }}
                />
            </ReferenceInput>
            <FormDataConsumer>
                {({ formData, ...rest }) =>
                    formData.crdId ? (
                        <SchemaVersionInput
                            crdId={formData.crdId}
                            disabled
                            {...rest}
                        />
                    ) : (
                        <TextInput
                            source="version"
                            helperText="Please select a CRD"
                            disabled
                        />
                    )
                }
            </FormDataConsumer>
            <TextInput source="schema" fullWidth />
        </SimpleForm>
    </Create>
);

export const SchemaShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="crdId" label="CRD" />
            <TextField source="version" />
            <TextField source="schema" />
        </SimpleShowLayout>
    </Show>
);
