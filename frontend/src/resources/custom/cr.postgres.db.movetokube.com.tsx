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
    SortPayload,
    Link,
    usePermissions,
} from 'react-admin';
import { View } from '../index';
import { formatArray, parseArray } from '../../utils';
import { ViewToolbar } from '../../components/ViewToolbar';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../../components/toolbars';
import { SimplePageTitle } from '../cr';
import { Box, Grid, Typography } from '@mui/material';
import { CR_POSTGRES_USERS } from './cr.postgresusers.db.movetokube.com';
import { useCrTransform } from '../../hooks/useCrTransform';
import DatasetIcon from '@mui/icons-material/Dataset';
import { Breadcrumb } from '@dslab/ra-breadcrumb';

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
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="metadata.name" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.database" validate={required()} 
                                helperText={`resources.${CR_POSTGRES_DB}.fields.spec.databaseHint`}/>
                        </Grid>
                        <Grid item xs={4}>
                            <BooleanInput source="spec.dropOnDelete" />
                        </Grid>

                        <Grid item xs={4}>
                            <TextInput
                                fullWidth
                                source="spec.extensions"
                                format={formatArray}
                                parse={parseArray}
                                helperText={`resources.${CR_POSTGRES_DB}.fields.spec.extensionsHint`}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput
                                fullWidth
                                source="spec.schemas"
                                format={formatArray}
                                parse={parseArray}
                                helperText={`resources.${CR_POSTGRES_DB}.fields.spec.schemasHint`}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth 
                            source="spec.masterRole" 
                            helperText={`resources.${CR_POSTGRES_DB}.fields.spec.masterRoleHint`}/>
                        </Grid>



                    </Grid>
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
            <Edit actions={<EditTopToolbar hasYaml />} mutationMode='pessimistic'>
                <SimpleForm toolbar={<ViewToolbar />}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput source="spec.database" validate={required()} fullWidth
                            helperText={`resources.${CR_POSTGRES_DB}.fields.spec.databaseHint`}/>
                        </Grid>
                        <Grid item xs={8}>
                            <BooleanInput source="spec.dropOnDelete" />
                        </Grid>

                        <Grid item xs={4}>
                            <TextInput
                                fullWidth
                                source="spec.extensions"
                                format={formatArray}
                                parse={parseArray}
                                helperText={`resources.${CR_POSTGRES_DB}.fields.spec.extensionsHint`}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput
                                fullWidth
                                source="spec.schemas"
                                format={formatArray}
                                parse={parseArray}
                                helperText={`resources.${CR_POSTGRES_DB}.fields.spec.schemasHint`}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth 
                            source="spec.masterRole" 
                            helperText={`resources.${CR_POSTGRES_DB}.fields.spec.masterRoleHint`}/>
                        </Grid>
                    </Grid>

                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_POSTGRES_DB, op)

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="list" crName={CR_POSTGRES_DB} />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.database" />
                    <Box textAlign={'right'}>
                        {hasPermission('write') && <EditButton />}
                        {hasPermission('read') && <ShowButton />}
                        {hasPermission('write') && <DeleteWithConfirmButton />}
                    </Box>
                </Datagrid>
            </List>
        </>
    );
};

const CrShow = () => {
    const { record } = useShowController();
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_POSTGRES_DB, op)

    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="show"
                crName={CR_POSTGRES_DB}
                crId={record.spec.database}
            />
            <Show actions={<ShowTopToolbar hasYaml hasEdit={hasPermission('write')} hasDelete={hasPermission('write')}  />}>
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
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_POSTGRES_USERS, op)

    const sort : SortPayload = { field: 'id', order: 'ASC' };
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
                    <Box textAlign={'right'}>
                        {hasPermission('write') && <EditButton resource={CR_POSTGRES_USERS} />}
                        {hasPermission('read') && <ShowButton resource={CR_POSTGRES_USERS} />}
                        {hasPermission('write') && <DeleteWithConfirmButton
                            redirect={false}
                            resource={CR_POSTGRES_USERS}/>}
                    </Box>
                </Datagrid>
            )}
            {hasPermission('write') && <Link to={`/${CR_POSTGRES_USERS}/create?db=${record.metadata.name}`}><Button label={`buttons.createUser`}></Button></Link>}
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
    icon: DatasetIcon,
};

export default CustomView;
