// SPDX-License-Identifier: Apache-2.0
import {
    EditButton,
    TextField,
    Show,
    SimpleShowLayout,
    DeleteWithConfirmButton,
    Create,
    SimpleForm,
    TextInput,
    TopToolbar as ReactAdminTopToolbar,
    required,
    Edit,
    useEditController,
    useShowController,
    ShowButton,
    ListButton,
    useNotify,
    useRedirect,
    useTranslate,
    SelectInput,
    usePermissions,
} from 'react-admin';
import { View } from '../index';
import { ViewToolbar } from '../../components/ViewToolbar';
import { TopToolbarProps } from '../../components/toolbars';
import { SimplePageTitle } from '../cr';
import { CR_POSTGRES_DB } from './cr.postgres.db.movetokube.com';
import { useCrTransform } from '../../hooks/useCrTransform';
import { Breadcrumbs, Grid, Typography } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import YamlButton from '../../components/YamlButton';

export const CR_POSTGRES_USERS = 'postgresusers.db.movetokube.com';

const CrCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();
    const { apiVersion, kind } = useCrTransform();

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

    const params = new URLSearchParams(window.location.search);
    const dbId = params.get('db') || '';

    const onSuccess = (data: any) => {
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('show', CR_POSTGRES_DB, dbId);
    };

    return (
        <>
            <BreadcrumbPostgresUser dbId={dbId} />
            <SimplePageTitle pageType="create" crName={CR_POSTGRES_USERS} />
            <Create
                mutationOptions={{ onSuccess }}
                actions={
                    <UserTopToolbar
                        redirect={`${CR_POSTGRES_DB}/${dbId}/show`}
                        buttons={{
                            hasList: true,
                        }}
                    />
                }
                transform={transform}
            >
                <SimpleForm validate={validate}>
                    <Grid container  spacing={2}>
                        <Grid item xs={3}>
                            <TextInput fullWidth source="metadata.name" validate={required()} />
                            <TextInput
                                source="spec.database"
                                validate={required()}
                                defaultValue={dbId}
                                disabled
                                sx={{ display: 'none' }}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextInput fullWidth source="spec.role" validate={required()} 
                            helperText={`resources.${CR_POSTGRES_USERS}.fields.spec.roleHint`}/>
                        </Grid>
                        <Grid item xs={2}>
                            <SelectInput fullWidth source="spec.privileges" validate={required()} choices={[
                                {id: 'OWNER', name: 'Owner'},
                                {id: 'READ', name: 'Read'},
                                {id: 'WRITE', name: 'Write'},
                            ]}/>
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.secretName" validate={required()} 
                            helperText={`resources.${CR_POSTGRES_USERS}.fields.spec.secretNameHint`}/>
                        </Grid>
                    </Grid>
                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const { record } = useEditController();
    if (!record) return null;

    const onSuccess = (data: any) => {
        notify('ra.notification.updated', {
            messageArgs: { smart_count: 1 },
            undoable: true,
        });
        redirect('show', CR_POSTGRES_DB, record.spec.database);
    };

    return (
        <>
            <BreadcrumbPostgresUser dbId={record.spec.database} />
            <SimplePageTitle
                pageType="edit"
                crName={CR_POSTGRES_USERS}
                crId={record.spec.role}
            />
            <Edit
                mutationOptions={{ onSuccess }}
                mutationMode='pessimistic'
                actions={
                    <UserTopToolbar
                        redirect={`${CR_POSTGRES_DB}/${record.spec.database}/show`}
                        buttons={{
                            hasShow: true,
                            hasList: true,
                            hasYaml: true
                        }}
                    />
                }
            >
                <SimpleForm toolbar={<ViewToolbar />}>
                    <Grid container  spacing={2}>
                        <Grid item xs={3}>
                            <TextInput fullWidth disabled source="spec.database" validate={required()} />
                        </Grid>
                        <Grid item xs={3}>
                            <TextInput fullWidth source="spec.role" validate={required()} 
                            helperText={`resources.${CR_POSTGRES_USERS}.fields.spec.roleHint`}/>
                        </Grid>
                        <Grid item xs={2}>
                            <SelectInput fullWidth source="spec.privileges" validate={required()} choices={[
                                {id: 'OWNER', name: 'Owner'},
                                {id: 'READ', name: 'Read'},
                                {id: 'WRITE', name: 'Write'},
                            ]}/>
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.secretName" validate={required()} 
                            helperText={`resources.${CR_POSTGRES_USERS}.fields.spec.secretNameHint`}/>
                        </Grid>
                    </Grid>

                </SimpleForm>
            </Edit>
        </>
    );
};

/*
const CrList = () => {
    return (
        <>
            <SimplePageTitle
                pageType="list"
                crName={CR_POSTGRES_USERS}
            />
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
*/

const CrShow = () => {
    const { record } = useShowController();
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_POSTGRES_USERS, op)

    if (!record) return null;

    return (
        <>
            <BreadcrumbPostgresUser dbId={record.spec.database} />
            <SimplePageTitle
                pageType="show"
                crName={CR_POSTGRES_USERS}
                crId={record.spec.role}
            />
            <Show
                actions={
                    <UserTopToolbar
                        redirect={`${CR_POSTGRES_DB}/${record.spec.database}/show`}
                        buttons={{
                            hasEdit: hasPermission('write'),
                            hasList: true,
                            hasDelete: hasPermission('write'),
                            hasYaml: true
                        }}
                    />
                }
            >
                <SimpleShowLayout>
                    <TextField source="spec.database" />
                    <TextField source="spec.role" />
                    <TextField source="spec.privileges" />
                    <TextField source="spec.secretName" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const UserTopToolbar = ({
    redirect,
    buttons,
}: {
    redirect: string;
    buttons: TopToolbarProps;
}) => {
    const { hasEdit, hasList, hasShow, hasDelete, hasYaml } = buttons;

    return (
        <ReactAdminTopToolbar>
            {hasYaml && <YamlButton key="yaml-button" />}
            {hasEdit && <EditButton key="edit-button" />}
            {hasShow && <ShowButton key="show-button" />}
            {hasList && <ListButton key="list-button" resource={redirect} />}
            {hasDelete && (
                <DeleteWithConfirmButton
                    key="delete-button"
                    redirect={`${window.location.origin}/${redirect}`}
                />
            )}
        </ReactAdminTopToolbar>
    );
};

const CustomView: View = {
    key: CR_POSTGRES_USERS,
    name: 'Postgres users',
    // list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
};

const BreadcrumbPostgresUser = ({ dbId }: { dbId: string }) => {
    const translate = useTranslate();
    const location = useLocation();

    const regexShow = `^/${CR_POSTGRES_USERS}/([^/]*)/show(/.*)?$`;
    const regexCreate = `^/${CR_POSTGRES_USERS}/create(/.*)?$`;
    const regexEdit = `^/${CR_POSTGRES_USERS}/([^/]*)(/[^/]*)?$`;

    let links = [];

    links.push({
        name: translate(`resources.${CR_POSTGRES_DB}.name`, {
            smart_count: 2,
        }),
        ref: `/${CR_POSTGRES_DB}`,
    });
    links.push({
        name: dbId,
        ref: `/${CR_POSTGRES_DB}/${dbId}/show`,
    });

    const matchShow = location.pathname.match(regexShow);
    if (matchShow && matchShow[1]) {
        // Show
        links.push({
            name: matchShow[1],
            ref: `/${CR_POSTGRES_USERS}/${matchShow[1]}/show`,
        });
    } else if (location.pathname.match(regexCreate)) {
        // Create
        links.push({
            name: translate('ra.action.create'),
            ref: `/${CR_POSTGRES_USERS}/create`,
        });
    } else {
        const matchEdit = location.pathname.match(regexEdit);
        if (matchEdit && matchEdit[1]) {
            // Edit
            links.push({
                name: matchEdit[1],
                ref: `/${CR_POSTGRES_USERS}/${matchEdit[1]}/show`,
            });
            links.push({
                name: translate('ra.action.edit'),
                ref: `/${CR_POSTGRES_USERS}/${matchEdit[1]}`,
            });
        }
    }

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ paddingTop: '10px' }}>
            <Link to="/" className="breadcrumb-link">
                {translate('ra.page.dashboard')}
            </Link>
            {links.map((page, index) =>
                index !== links.length - 1 ? (
                    <Link
                        key={page.name}
                        to={page.ref}
                        className="breadcrumb-link"
                    >
                        {page.name}
                    </Link>
                ) : (
                    <Typography key={page.name} color="text.primary">
                        {page.name}
                    </Typography>
                )
            )}
        </Breadcrumbs>
    );
};

export default CustomView;
