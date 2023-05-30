import {
    CreateButton,
    DeleteWithConfirmButton,
    EditButton,
    ListButton,
    TopToolbar as ReactAdminTopToolbar,
    ShowButton,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { useUpdateCrdIds } from '../hooks/useUpdateCrdIds';

export const TopToolbar = (props: TopToolbarProps) => {
    const { hasCreate, hasEdit, hasShow, hasList, hasDelete } = props;

    const resource = useResourceContext();
    const redirect = useRedirect();
    const notify = useNotify();
    const { updateCrdIds } = useUpdateCrdIds();

    const onSuccess = (data: any) => {
        if (resource === 'crs') {
            updateCrdIds();
        }
        notify('ra.notification.deleted', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <ReactAdminTopToolbar>
            {hasCreate && <CreateButton key="create-button" />}
            {hasEdit && <EditButton key="edit-button" />}
            {hasShow && <ShowButton key="show-button" />}
            {hasList && <ListButton key="list-button" />}
            {hasDelete && (
                <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />
            )}
        </ReactAdminTopToolbar>
    );
};

export interface TopToolbarProps {
    hasShow?: boolean;
    hasList?: boolean;
    hasEdit?: boolean;
    hasCreate?: boolean;
    hasDelete?: boolean;
}

export const CreateTopToolbar = (props: TopToolbarProps) => {
    const { hasList = true } = props;
    return <TopToolbar {...props} hasList={hasList} />;
};

export const EditTopToolbar = (props: TopToolbarProps) => {
    const { hasList = true, hasShow = true } = props;
    return <TopToolbar {...props} hasList={hasList} hasShow={hasShow} />;
};

export const ListTopToolbar = (props: TopToolbarProps) => {
    const { hasCreate = true } = props;
    return <TopToolbar {...props} hasCreate={hasCreate} />;
};

export const ShowTopToolbar = (props: TopToolbarProps) => {
    const { hasEdit = true, hasList = true, hasDelete = true } = props;
    return (
        <TopToolbar
            {...props}
            hasEdit={hasEdit}
            hasList={hasList}
            hasDelete={hasDelete}
        />
    );
};
