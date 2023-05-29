import {
    Button,
    ShowButton,
    TopToolbar,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const EditTopToolbar = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();
    const translate = useTranslate();

    const handleListClick = () => {
        redirect('list', resource);
    };

    return (
        <TopToolbar>
            <ShowButton key="show-button" />
            <Button
                label={translate('button.list')}
                onClick={handleListClick}
                startIcon={<FormatListBulletedIcon />}
            />
        </TopToolbar>
    );
};

export default EditTopToolbar;
