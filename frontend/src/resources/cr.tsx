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
    useResourceContext,
    useGetOne,
    Loading,
    DeleteWithConfirmButton,
} from 'react-admin';
import { parse, format } from '../utils';
import { CrdProps } from '../components/CrdProps';
import { DeleteConfirmToolbar } from '../components/DeleteConfirmToolbar';

export const CrList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="apiVersion" />
            <TextField source="kind" />
            <EditButton />
            <ShowButton />
            <DeleteWithConfirmButton />
        </Datagrid>
    </List>
);

export const CrEdit = () => (
    <Edit>
        <SimpleForm toolbar={<DeleteConfirmToolbar />}>
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

export const CrCreate = () => {
    const crdId = useResourceContext();
    return (
        <Create>
            <SimpleForm>
                {crdId && <ApiVersionInput crdId={crdId} />}
                {crdId && <KindInput crdId={crdId} />}
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
};

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

const ApiVersionInput = ({ crdId }: CrdProps) => {
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    const group = data.spec.group;
    const storedVersion = data.spec.versions.filter(
        (version: any) => version.storage
    )[0];
    const apiVersion = `${group}/${storedVersion.name}`;
    return (
        <TextInput
            source="apiVersion"
            defaultValue={apiVersion}
            sx={{ width: '22em' }}
            disabled
        />
    );
};

const KindInput = ({ crdId } : CrdProps) => {
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return (
        <TextInput
            source="kind"
            defaultValue={data.spec.names.kind}
            disabled
        />
    );
};
