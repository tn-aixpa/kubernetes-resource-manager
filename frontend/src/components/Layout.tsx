import {
    Layout,
    LayoutProps,
    Menu,
    MenuProps,
    useResourceDefinitions,
} from 'react-admin';
import { Divider } from '@mui/material';

const MyMenu = (props: MenuProps) => {
    const resources = useResourceDefinitions();
    return (
        <Menu {...props}>
            <Menu.DashboardItem />
            {Object.keys(resources).map(name =>
                name !== 'crd' && name !== 'crs' && (
                        <Menu.ResourceItem key={name} name={name} />
                    )
                )
            }
            <div key="settings">
                <Divider />
                <Menu.ResourceItem name={"crs"} />
            </div>
        </Menu>
    );
};

const MyLayout = (props: LayoutProps) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
