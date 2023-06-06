import {
    Layout,
    LayoutProps,
    Menu,
    MenuProps,
    ResourceDefinition,
    useResourceDefinitions,
    useTranslate,
} from 'react-admin';
import { Divider } from '@mui/material';

const MyMenu = (props: MenuProps) => {
    const resources = useResourceDefinitions();
    const translate = useTranslate();
    return (
        <Menu {...props}>
            <Menu.DashboardItem primaryText={translate('dashboard.name')} />
            {Object.values(resources).map(
                (resource: ResourceDefinition) =>
                    resource.name !== 'crd' &&
                    resource.name !== 'crs' &&
                    resource.hasList && (
                        <Menu.ResourceItem
                            key={resource.name}
                            name={resource.name}
                        />
                    )
            )}
            <div key="settings">
                <Divider />
                <Menu.ResourceItem name={'crs'} />
            </div>
        </Menu>
    );
};

const MyLayout = (props: LayoutProps) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
