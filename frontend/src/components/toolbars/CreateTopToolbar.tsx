import {
    Button,
    TopToolbar,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const CreateTopToolbar = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();
    const translate = useTranslate();

    const handleListClick = () => {
        redirect('list', resource);
    };

    return (
        <TopToolbar>
            <Button
                label={translate('button.list')}
                onClick={handleListClick}
                startIcon={<FormatListBulletedIcon />}
            />
        </TopToolbar>
    );
};

export default CreateTopToolbar;
