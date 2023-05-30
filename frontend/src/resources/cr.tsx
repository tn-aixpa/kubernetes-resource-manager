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
import { ViewToolbar } from '../components/ViewToolbar';
import {
    AceEditorField,
    AceEditorInput,
} from '@smartcommunitylab/ra-ace-editor';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';

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
                <SimpleForm toolbar={<ViewToolbar />}>
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

export const SimplePageTitle = ({
    pageType,
    crName,
}: {
    pageType: string;
    crName: string;
}) => {
    const translate = useTranslate();

    return (
        <Typography
            variant="h4"
            className="login-page-title"
            sx={{ padding: '20px 0px 12px 0px' }}
        >
            {translate('pages.cr.' + pageType + '.title') +
                translate('pages.cr.' + crName)}
        </Typography>
    );
};

export const ApiVersionInput = ({ crdId }: CrdProps) => {
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

export const KindInput = ({ crdId }: CrdProps) => {
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return (
        <TextInput source="kind" defaultValue={data.spec.names.kind} disabled />
    );
};

export interface CrdProps {
    crdId: string;
}
