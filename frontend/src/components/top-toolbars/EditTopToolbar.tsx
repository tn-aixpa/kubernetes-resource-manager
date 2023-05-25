import {
    Button,
    ShowButton,
    TopToolbar,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const EditTopToolbar = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();

    const handleListClick = () => {
        redirect('list', resource);
    };

    return (
        <TopToolbar>
            <ShowButton key="show-button" />
            <Button
                label="List"
                onClick={handleListClick}
                startIcon={<FormatListBulletedIcon />}
            />
        </TopToolbar>
    );
};

export default EditTopToolbar;
