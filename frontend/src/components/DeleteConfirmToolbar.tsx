import {
    SaveButton,
    Toolbar,
    DeleteWithConfirmButton,
    ToolbarClasses,
    useResourceContext,
    useNotify,
    useRedirect,
} from 'react-admin';
import { useUpdateCrdIds } from '../hooks/useUpdateCrdIds';

export const DeleteConfirmToolbar = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const { updateCrdIds } = useUpdateCrdIds();

    const onSuccess = (data: any) => {
        if (resource === 'crs') {
            updateCrdIds();
        }
        notify('ra.notification.deleted', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <Toolbar>
            <div className={ToolbarClasses.defaultToolbar}>
                <SaveButton />
                <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />
            </div>
        </Toolbar>
    );
};
