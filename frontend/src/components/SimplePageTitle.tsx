import { useTranslate } from 'react-admin';
import { Typography } from '@mui/material';

export const SimplePageTitle = ({
    pageType,
    crName,
}: {
    pageType: string;
    crName: string;
}) => {
    const translate = useTranslate();

    return (
        <Typography
            variant="h4"
            className="login-page-title"
            sx={{ padding: '20px 0px 12px 0px' }}
        >
            {translate('pages.cr.' + pageType + '.title') +
                translate('pages.cr.' + crName)}
        </Typography>
    );
};
