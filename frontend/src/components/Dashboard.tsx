import { CardContent, CardHeader } from '@mui/material';
import { useTranslate } from 'react-admin';

const MyDashboard = () => {
    const translate = useTranslate();

    return (
        <>
            <CardHeader title={translate('dashboard.title')} />
            <CardContent>{translate('dashboard.message')}</CardContent>
        </>
    );
};

export default MyDashboard;
