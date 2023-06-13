import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
    Show,
    SimpleShowLayout,
    DeleteWithConfirmButton,
    useShowController,
    BooleanField,
    Create,
    SimpleForm,
    TextInput,
    required,
    BooleanInput,
    Edit,
    useEditController,
    useGetList,
    Loading,
    useTranslate,
    Button,
} from 'react-admin';
import { View } from './index';
import { formatArray, parseArray } from '../utils';
import { ViewToolbar } from '../components/ViewToolbar';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { SimplePageTitle } from './cr';
import { Typography } from '@mui/material';
import { CR_POSTGRES_USERS } from './cr.postgresusers.db.movetokube.com';
import Breadcrumb from '../components/Breadcrumb';
import { useCrTransform } from '../hooks/useCrTransform';

export const CR_POSTGRES_DB = 'postgres.db.movetokube.com';

const CrCreate = () => {
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
            <SimplePageTitle pageType="create" crName={CR_POSTGRES_DB} />
            <Create
                redirect="list"
                actions={<CreateTopToolbar />}
                transform={transform}
            >
                <SimpleForm validate={validate}>
                    <TextInput source="metadata.name" validate={required()} />
                    <TextInput source="spec.database" validate={required()} />
                    <BooleanInput source="spec.dropOnDelete" />
                    <TextInput
                        fullWidth
                        source="spec.extensions"
                        format={formatArray}
                        parse={parseArray}
                    />
                    <TextInput source="spec.masterRole" />
                    <TextInput
                        fullWidth
                        source="spec.schemas"
                        format={formatArray}
                        parse={parseArray}
                    />
                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const { record } = useEditController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="edit"
                crName={CR_POSTGRES_DB}
                crId={record.spec.database}
            />
            <Edit actions={<EditTopToolbar hasYaml />}>
                <SimpleForm toolbar={<ViewToolbar />}>
                    <TextInput source="spec.database" validate={required()} />
                    <BooleanInput source="spec.dropOnDelete" />
                    <TextInput
                        fullWidth
                        source="spec.extensions"
                        format={formatArray}
                        parse={parseArray}
                    />
                    <TextInput source="spec.masterRole" />
                    <TextInput
                        fullWidth
                        source="spec.schemas"
                        format={formatArray}
                        parse={parseArray}
                    />
                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="list" crName={CR_POSTGRES_DB} />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.database" />
                    <EditButton />
                    <ShowButton />
                    <DeleteWithConfirmButton />
                </Datagrid>
            </List>
        </>
    );
};

const CrShow = () => {
    const { record } = useShowController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="show"
                crName={CR_POSTGRES_DB}
                crId={record.spec.database}
            />
            <Show actions={<ShowTopToolbar hasYaml />}>
                <SimpleShowLayout>
                    <TextField source="spec.database" />
                    <BooleanField source="spec.dropOnDelete" />
                    <TextField source="spec.extensions" />
                    <TextField source="spec.masterRole" />
                    <TextField source="spec.schemas" />
                    <PostgresUsers />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const PostgresUsers = () => {
    const translate = useTranslate();
    const { record } = useShowController();

    const sort = { field: 'id', order: 'ASC' };
    const { data, total, isLoading } = useGetList(CR_POSTGRES_USERS, {
        pagination: { page: 1, perPage: 1000 },
        sort: sort,
    });

    if (isLoading) return <Loading />;
    if (!data) return null;

    const dbUsers = data.filter(
        (user: any) => user.spec.database === record.metadata.name
    );

    return (
        <>
            <Typography variant="h6">
                {translate(`resources.${CR_POSTGRES_USERS}.shortName`)}
            </Typography>
            {dbUsers.length > 0 && (
                <Datagrid
                    data={dbUsers}
                    total={total}
                    isLoading={isLoading}
                    sort={sort}
                >
                    <TextField
                        source="id"
                        label={`resources.${CR_POSTGRES_USERS}.fields.id`}
                    />
                    <TextField
                        source="spec.role"
                        label={`resources.${CR_POSTGRES_USERS}.fields.spec.role`}
                    />
                    <TextField
                        source="spec.privileges"
                        label={`resources.${CR_POSTGRES_USERS}.fields.spec.privileges`}
                    />
                    <TextField
                        source="spec.secretName"
                        label={`resources.${CR_POSTGRES_USERS}.fields.spec.secretName`}
                    />
                    <EditButton resource={CR_POSTGRES_USERS} />
                    <ShowButton resource={CR_POSTGRES_USERS} />
                    <DeleteWithConfirmButton
                        redirect={false}
                        resource={CR_POSTGRES_USERS}
                    />
                </Datagrid>
            )}
            <Button
                label={`buttons.createUser`}
                href={`${window.location.origin}/${CR_POSTGRES_USERS}/create?db=${record.metadata.name}`}
            ></Button>
        </>
    );
};

const CustomView: View = {
    key: CR_POSTGRES_DB,
    name: 'Postgres',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
};

export default CustomView;
