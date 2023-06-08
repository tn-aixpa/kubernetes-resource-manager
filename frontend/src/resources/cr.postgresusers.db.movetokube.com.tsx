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
} from 'react-admin';
import { View } from './index';
import { ViewToolbar } from '../components/ViewToolbar';
import { TopToolbarProps } from '../components/toolbars';
import { SimplePageTitle } from './cr';
import { CR_POSTGRES_DB } from './cr.postgres.db.movetokube.com';
import { useCrTransform } from '../hooks/useCrTransform';

export const CR_POSTGRES_USERS = 'postgresusers.db.movetokube.com';

const CrCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const { apiVersion, kind } = useCrTransform();
    const transform = (cr: any) => ({
        ...cr,
        apiVersion: apiVersion,
        kind: kind,
    });

    const params = new URLSearchParams(window.location.search);
    const dbId = params.get('db') || '';

    const onSuccess = (data: any) => {
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('show', CR_POSTGRES_DB, dbId);
    };

    return (
        <>
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
                <SimpleForm>
                    <TextInput source="metadata.name" validate={required()} />
                    <TextInput
                        source="spec.database"
                        validate={required()}
                        defaultValue={dbId}
                        disabled
                        sx={{ display: 'none' }}
                    />
                    <TextInput source="spec.role" validate={required()} />
                    <TextInput source="spec.privileges" validate={required()} />
                    <TextInput source="spec.secretName" validate={required()} />
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
            <SimplePageTitle
                pageType="edit"
                crName={CR_POSTGRES_USERS}
                crId={record.spec.role}
            />
            <Edit
                mutationOptions={{ onSuccess }}
                actions={
                    <UserTopToolbar
                        redirect={`${CR_POSTGRES_DB}/${record.spec.database}/show`}
                        buttons={{
                            hasShow: true,
                            hasList: true,
                        }}
                    />
                }
            >
                <SimpleForm toolbar={<ViewToolbar />}>
                    <TextInput source="spec.database" validate={required()} />
                    <TextInput source="spec.role" validate={required()} />
                    <TextInput source="spec.privileges" validate={required()} />
                    <TextInput source="spec.secretName" validate={required()} />
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
    if (!record) return null;

    return (
        <>
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
                            hasEdit: true,
                            hasList: true,
                            hasDelete: true,
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
    const { hasEdit, hasList, hasShow, hasDelete } = buttons;

    return (
        <ReactAdminTopToolbar>
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

export default CustomView;
