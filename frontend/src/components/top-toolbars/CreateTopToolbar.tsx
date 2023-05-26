import {
    Button,
    TopToolbar,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const CreateTopToolbar = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();

    const handleListClick = () => {
        redirect('list', resource);
    };

    return (
        <TopToolbar>
            <Button
                label="List"
                onClick={handleListClick}
                startIcon={<FormatListBulletedIcon />}
            />
        </TopToolbar>
    );
};

export default CreateTopToolbar;
