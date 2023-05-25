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
} from 'react-admin';
import { parse, format } from '../utils';
import { CrdProps } from '../components/CrdProps';
import { DeleteConfirmToolbar } from '../components/DeleteConfirmToolbar';
import { Typography } from '@mui/material';
import ListActionsCreate from '../components/ListActionsCreate';
// TODO contact backend to use kind instead of crdid in titles

// TODO (also for crs): remove delete from edit, put delete in show, put back to list in show (useRedirect) (cancel in edit), change create redirect to list
export const CrList = () => {
    const crdId = useResourceContext();
    const translate = useTranslate();

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {crdId + translate('pages.cr.list.title')}
            </Typography>
            <List actions={<ListActionsCreate />}>
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

export const CrEdit = () => {
    const crdId = useResourceContext();
    const translate = useTranslate();

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {translate('pages.cr.edit.title') + crdId}
            </Typography>
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
        </>
    );
};

export const CrCreate = () => {
    const crdId = useResourceContext();
    const translate = useTranslate();

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {translate('pages.cr.create.title') + crdId}
            </Typography>
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
        </>
    );
};

export const CrShow = () => {
    const crdId = useResourceContext();
    const translate = useTranslate();

    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {translate('pages.cr.show.title') + crdId}
            </Typography>
            <Show>
                <SimpleShowLayout>
                    <TextField source="id" />
                    <TextField source="apiVersion" />
                    <TextField source="kind" />
                    <TextField source="metadata" />
                    <TextField source="spec" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

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

const KindInput = ({ crdId }: CrdProps) => {
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return (
        <TextInput source="kind" defaultValue={data.spec.names.kind} disabled />
    );
};
