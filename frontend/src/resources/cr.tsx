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
    useEditController,
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
import { Breadcrumb } from '../components/Breadcrumb';
import { useCrTransform } from '../hooks/useCrTransform';

export const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const translate = useTranslate();

    const transform = (data: any) => {
        return {
            ...data,
            apiVersion: apiVersion,
            kind: kind,
        };
    };

    const validate = (values: any) => {
        if (!apiVersion || !kind) {
            return {
                apiVersion: translate('resources.cr.transformError'),
                kind: translate('resources.cr.transformError'),
            };
        }

        return {};
    };

    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="create" />
            <Create
                redirect="list"
                actions={<CreateTopToolbar />}
                transform={transform}
            >
                <SimpleForm validate={validate}>
                    <TextInput
                        source="metadata.name"
                        validate={required()}
                        label={'resources.cr.fields.metadata.name'}
                    />

                    <AceEditorInput
                        mode="json"
                        source="spec"
                        theme="monokai"
                        format={formatJson}
                        parse={parseJson}
                        label={'resources.cr.fields.spec'}
                    />
                </SimpleForm>
            </Create>
        </>
    );
};

export const CrEdit = () => {
    const { record } = useEditController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="edit" crId={record.id} />
            <Edit actions={<EditTopToolbar hasYaml />}>
                <SimpleForm toolbar={<ViewToolbar />}>
                    <AceEditorInput
                        mode="json"
                        source="spec"
                        theme="monokai"
                        format={formatJson}
                        parse={parseJson}
                        label={'resources.cr.fields.spec'}
                    />
                </SimpleForm>
            </Edit>
        </>
    );
};

export const CrList = () => {
    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="list" />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" label={'resources.cr.fields.id'} />
                    <TextField
                        source="apiVersion"
                        label={'resources.cr.fields.apiVersion'}
                    />
                    <TextField
                        source="kind"
                        label={'resources.cr.fields.kind'}
                    />
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
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <PageTitle pageType="show" crId={record.id} />
            <Show actions={<ShowTopToolbar hasYaml />}>
                <SimpleShowLayout>
                    <TextField source="id" label={'resources.cr.fields.id'} />
                    <TextField
                        source="apiVersion"
                        label={'resources.cr.fields.apiVersion'}
                    />
                    <TextField
                        source="kind"
                        label={'resources.cr.fields.kind'}
                    />
                    <AceEditorField
                        mode="json"
                        record={{
                            metadata: JSON.stringify(record.metadata),
                        }}
                        source="metadata"
                        label={'resources.cr.fields.metadata'}
                    />
                    <AceEditorField
                        mode="json"
                        record={{
                            spec: JSON.stringify(record.spec),
                        }}
                        source="spec"
                        label={'resources.cr.fields.spec'}
                    />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const PageTitle = ({ pageType, crId }: { pageType: string; crId?: string }) => {
    const crdId = useResourceContext();
    const translate = useTranslate();

    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;

    return (
        <Typography variant="h4" className="page-title">
            {translate(`ra.page.${pageType}`, {
                name: data.spec.names.kind,
                recordRepresentation: crId,
            })}
        </Typography>
    );
};

export const SimplePageTitle = ({
    pageType,
    crName,
    crId = '',
}: {
    pageType: string;
    crName: string;
    crId?: string;
}) => {
    const translate = useTranslate();

    const smartCount = pageType === 'list' ? 2 : 1;
    const name = translate(`resources.${crName}.name`, {
        smart_count: smartCount,
    });

    return (
        <Typography variant="h4" className="page-title">
            {translate(`ra.page.${pageType}`, {
                name: name,
                recordRepresentation: crId,
            })}
        </Typography>
    );
};
