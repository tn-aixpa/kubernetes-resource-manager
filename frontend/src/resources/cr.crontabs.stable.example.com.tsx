import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
    Show,
    SimpleShowLayout,
    DeleteWithConfirmButton,
} from 'react-admin';
import { View } from './index';
import { Typography } from '@mui/material';
import ListTopToolbar from '../components/top-toolbars/ListTopToolbar';

const CrList = () => {
    return (
        <>
            <Typography
                variant="h4"
                className="login-page-title"
                sx={{ padding: '20px 0px 12px 0px' }}
            >
                {'Custom title'}
            </Typography>
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField label="API Version" source="apiVersion" />
                    <TextField source="kind" />
                    <EditButton />
                    <ShowButton />
                    <DeleteWithConfirmButton />
                </Datagrid>
            </List>
        </>
    );
};

const CrShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField label="API Version" source="apiVersion" />
            <TextField source="kind" />
            <TextField source="metadata" />
            <TextField source="spec" />
        </SimpleShowLayout>
    </Show>
);

const CustomView: View = {
    key: 'crontabs.stable.example.com',
    name: 'Cron Tabs',
    list: CrList,
    show: CrShow,
};

export default CustomView;
