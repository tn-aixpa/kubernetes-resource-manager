import {
    DeleteWithConfirmButton,
    useResourceContext,
    useNotify,
    useRedirect,
    TopToolbar,
    EditButton,
    Button,
} from 'react-admin';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useUpdateCrdIds } from '../../hooks/useUpdateCrdIds';

const ShowTopToolbar = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const { updateCrdIds } = useUpdateCrdIds();

    const handleListClick = () => {
        redirect('list', resource);
    };

    const onSuccess = (data: any) => {
        if (resource === 'crs') {
            updateCrdIds();
        }
        notify('ra.notification.deleted', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <TopToolbar>
            <EditButton key="edit-button" />
            <Button
                label="List"
                onClick={handleListClick}
                startIcon={<FormatListBulletedIcon />}
            />
            <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />
        </TopToolbar>
    );
};

export default ShowTopToolbar;
