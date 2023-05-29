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
    useTranslate,
    useShowController,
} from 'react-admin';
import { parseJson, formatJson } from '../utils';
import { Typography } from '@mui/material';
import ListTopToolbar from '../components/toolbars/ListTopToolbar';
import { SaveToolbar } from '../components/toolbars/SaveToolbar';
import ShowTopToolbar from '../components/toolbars/ShowTopToolbar';
import EditTopToolbar from '../components/toolbars/EditTopToolbar';
import {
    AceEditorField,
    AceEditorInput,
} from '@smartcommunitylab/ra-ace-editor';
import CreateTopToolbar from '../components/toolbars/CreateTopToolbar';
import KindInput from '../components/inputs/KindInput';
import ApiVersionInput from '../components/inputs/ApiVersionInput';

export const CrCreate = () => {
    const crdId = useResourceContext();

    return (
        <>
            <PageTitle pageType="create" />
            <Create redirect="list" actions={<CreateTopToolbar />}>
                <SimpleForm>
                    {crdId && <ApiVersionInput crdId={crdId} />}
                    {crdId && <KindInput crdId={crdId} />}
                    <TextInput source="metadata.name" validate={required()} />

                    <AceEditorInput
                        mode="json"
                        source="spec"
                        theme="monokai"
                        format={formatJson}
                        parse={parseJson}
                    />
                </SimpleForm>
            </Create>
        </>
    );
};

export const CrEdit = () => {
    return (
        <>
            <PageTitle pageType="edit" />
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<SaveToolbar />}>
                    <TextInput source="apiVersion" disabled />
                    <TextInput source="kind" disabled />
                    <TextInput source="metadata.name" disabled />
                    <AceEditorInput
                        mode="json"
                        source="spec"
                        theme="monokai"
                        format={formatJson}
                        parse={parseJson}
                    />
                </SimpleForm>
            </Edit>
        </>
    );
};

export const CrList = () => {
    return (
        <>
            <PageTitle pageType="list" />
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

export const CrShow = () => {
    const { record } = useShowController();

    return (
        <>
            <PageTitle pageType="show" />
            <Show actions={<ShowTopToolbar />}>
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="apiVersion" />
                    <TextField source="kind" />
                    <AceEditorField
                        mode="json"
                        record={{
                            metadata: JSON.stringify(record.metadata),
                        }}
                        source="metadata"
                    />
                    <AceEditorField
                        mode="json"
                        record={{
                            spec: JSON.stringify(record.spec),
                        }}
                        source="spec"
                    />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const PageTitle = ({ pageType }: { pageType: string }) => {
    const crdId = useResourceContext();
    const translate = useTranslate();

    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;

    return (
        <Typography
            variant="h4"
            className="login-page-title"
            sx={{ padding: '20px 0px 12px 0px' }}
        >
            {translate('pages.cr.' + pageType + '.title') +
                data.spec.names.kind}
        </Typography>
    );
};
