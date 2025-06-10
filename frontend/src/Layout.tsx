// SPDX-License-Identifier: Apache-2.0
import {
    Layout,
    LayoutProps,
    Menu,
    MenuProps,
    ResourceDefinition,
    usePermissions,
    useResourceDefinitions,
} from 'react-admin';
import { Divider } from '@mui/material';

const MyMenu = (props: MenuProps) => {
    const resources = useResourceDefinitions();
    const { permissions } = usePermissions();
    return (
        <Menu {...props}>
            <Menu.DashboardItem />
            <Divider />
            {Object.values(resources).map(
                (resource: ResourceDefinition) =>
                    resource.name !== 'crd' &&
                    resource.name !== 'crs' &&
                    !resource.name.startsWith('k8s') &&
                    resource.hasList && 
                    permissions && permissions.canAccess(resource.name, 'list') && (
                        <Menu.ResourceItem
                            key={resource.name}
                            name={resource.name}
                        />
                    )
            )}
            <Divider />
            {permissions && permissions.canAccess('k8s_service', 'list') && <Menu.ResourceItem name={'k8s_service'} />}
            {permissions && permissions.canAccess('k8s_deployment', 'list') && <Menu.ResourceItem name={'k8s_deployment'} />}
            {permissions && permissions.canAccess('k8s_job', 'list') && <Menu.ResourceItem name={'k8s_job'} />  }                  
            {permissions && permissions.canAccess('k8s_pvc', 'list') && <Menu.ResourceItem name={'k8s_pvc'} /> }
            {permissions && permissions.canAccess('k8s_secret', 'list') && <Menu.ResourceItem name={'k8s_secret'} /> }
            {permissions && permissions.canAccess('k8s_quota', 'list') && <Menu.ResourceItem name={'k8s_quota'} />}
            <div key="settings">
                <Divider />
                <Menu.ResourceItem name={'crs'} />
            </div>
        </Menu>
    );
};

const MyLayout = (props: LayoutProps) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
