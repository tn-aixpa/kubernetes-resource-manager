// SPDX-License-Identifier: Apache-2.0
import {
    EditButton,
    ShowButton,
    TextField,
    Show,
    SimpleShowLayout,
    useShowController,
    Create,
    SimpleForm,
    TextInput,
    required,
    Edit,
    useEditController,
    useTranslate,
    PasswordInput,
    ReferenceArrayInput,
    ReferenceArrayField,
    TopToolbar,
    ListButton,
    usePermissions,
} from 'react-admin';
import { View } from '../index';
import { ViewToolbar } from '../../components/ViewToolbar';
import { SimplePageTitle } from '../cr';
import { Grid } from '@mui/material';
import { useCrTransform } from '../../hooks/useCrTransform';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { CR_MINIO_BUCKETS } from './cr.buckets.minio.scc-digitalhub.github.io';
import { InspectButton } from '@dslab/ra-inspect-button';

export const CR_MINIO_USERS = 'users.minio.scc-digitalhub.github.io';

const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const translate = useTranslate();

    const transform = (data: any) => {
        return {
            ...data,
            apiVersion: apiVersion,
            kind: kind,
        };
    };

    const validate = (values: any) => {
        if (!apiVersion || !kind) {
            return {
                apiVersion: translate('resources.cr.transformError'),
                kind: translate('resources.cr.transformError'),
            };
        }

        return {};
    };

    return (
        <>
            <SimplePageTitle pageType="create" crName={CR_MINIO_USERS} />
            <Create
                redirect="show" 
                actions={
                <TopToolbar>
                    <ListButton resource={CR_MINIO_BUCKETS}/>
                </TopToolbar>                    
                }
                transform={transform}
            >
                <SimpleForm validate={validate}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="metadata.name" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.accessKey" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <PasswordInput fullWidth source="spec.secretKey" validate={required()} />
                        </Grid>
                        <Grid item xs={12}>
                            <ReferenceArrayInput 
                                source="spec.policies" fullWidth
                                perPage={1000}
                                reference="policies.minio.scc-digitalhub.github.io"

                            />
                        </Grid> 
                    </Grid>
                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const { record } = useEditController();
    if (!record) return null;

    return (
        <>
            <SimplePageTitle
                pageType="edit"
                crName={CR_MINIO_USERS}
                crId={record.spec.database}
            />
            <Edit actions={false} mutationMode='pessimistic'>
                <TopToolbar>
                    <ShowButton/>
                    <InspectButton/>
                    <ListButton resource={CR_MINIO_BUCKETS}/>
                </TopToolbar>

                <SimpleForm toolbar={<ViewToolbar />}>
                    <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={4}>
                            <TextInput fullWidth source="spec.accessKey" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <PasswordInput fullWidth source="spec.secretKey" validate={required()} />
                        </Grid>
                        <Grid item xs={12}>
                            <ReferenceArrayInput 
                                source="spec.policies" fullWidth
                                perPage={1000}
                                reference="policies.minio.scc-digitalhub.github.io"

                            />
                        </Grid> 
                    </Grid>

                </SimpleForm>
            </Edit>
        </>
    );
};

const CrShow = () => {
    const { record } = useShowController();
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_MINIO_USERS, op)

    if (!record) return null;

    return (
        <>
            <SimplePageTitle
                pageType="show"
                crName={CR_MINIO_USERS}
                crId={record.spec.name}
            />
            <Show actions={false}>
                <TopToolbar>
                    <InspectButton/>
                    {hasPermission('write') && <EditButton/>}
                    <ListButton resource={CR_MINIO_BUCKETS}/>
                </TopToolbar>
                <SimpleShowLayout>
                    <TextField source="spec.accessKey" />
                    <ReferenceArrayField source="spec.policies" reference='policies.minio.scc-digitalhub.github.io' />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const CustomView: View = {
    key: CR_MINIO_USERS,
    name: 'S3',
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
    icon: FolderDeleteIcon,
};

export default CustomView;
