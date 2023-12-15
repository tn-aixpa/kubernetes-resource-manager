import {
    Layout,
    LayoutProps,
    Menu,
    MenuProps,
    ResourceDefinition,
    useResourceDefinitions,
} from 'react-admin';
import { Divider } from '@mui/material';

const MyMenu = (props: MenuProps) => {
    const resources = useResourceDefinitions();
    return (
        <Menu {...props}>
            <Menu.DashboardItem />
            <Divider />
            {Object.values(resources).map(
                (resource: ResourceDefinition) =>
                    resource.name !== 'crd' &&
                    resource.name !== 'crs' &&
                    !resource.name.startsWith('k8s') &&
                    resource.hasList && (
                        <Menu.ResourceItem
                            key={resource.name}
                            name={resource.name}
                        />
                    )
            )}
            <Divider />
            <Menu.ResourceItem name={'k8s_service'} />
            <Menu.ResourceItem name={'k8s_deployment'} />
            <Menu.ResourceItem name={'k8s_job'} />                    
            <Menu.ResourceItem name={'k8s_pvc'} />
            <Menu.ResourceItem name={'k8s_secret'} />
            <div key="settings">
                <Divider />
                <Menu.ResourceItem name={'crs'} />
            </div>
        </Menu>
    );
};

const MyLayout = (props: LayoutProps) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
