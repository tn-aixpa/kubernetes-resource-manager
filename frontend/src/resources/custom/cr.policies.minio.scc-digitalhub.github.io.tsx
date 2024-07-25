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
    TopToolbar,
    ListButton,
    Labeled,
    usePermissions,
} from 'react-admin';
import { View } from '../index';
import { ViewToolbar } from '../../components/ViewToolbar';
import { SimplePageTitle } from '../cr';
import { Grid } from '@mui/material';
import { useCrTransform } from '../../hooks/useCrTransform';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { AceEditorInput } from '@dslab/ra-ace-editor';
import { InspectButton } from '@dslab/ra-inspect-button';

import AceEditor from 'react-ace';

import { CR_MINIO_BUCKETS } from './cr.buckets.minio.scc-digitalhub.github.io';

export const CR_MINIO_POLICIES = 'policies.minio.scc-digitalhub.github.io';

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
            <SimplePageTitle pageType="create" crName={CR_MINIO_POLICIES} />
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
                            <TextInput fullWidth source="spec.name" validate={required()} 
                                helperText={`resources.${CR_MINIO_POLICIES}.fields.spec.nameHint`}/>
                        </Grid>
                        <Grid item xs={8}>
                            <AceEditorInput
                                fullWidth
                                mode="json"
                                source="spec.content"
                                theme="monokai"
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
                crName={CR_MINIO_POLICIES}
                crId={record.spec.database}
            />
            <Edit actions={false} mutationMode='pessimistic'>
                <TopToolbar>
                    <InspectButton/>
                    <ShowButton/>
                    <ListButton resource={CR_MINIO_BUCKETS}/>
                </TopToolbar>

                <SimpleForm toolbar={<ViewToolbar />}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="metadata.name" disabled validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.name" validate={required()} 
                                helperText={`resources.${CR_MINIO_POLICIES}.fields.spec.nameHint`}/>
                        </Grid>
                        <Grid item xs={8}>
                            <AceEditorInput
                                fullWidth
                                mode="json"
                                source="spec.content"
                                theme="monokai"
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
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_MINIO_POLICIES, op)

    if (!record) return null;

    return (
        <>
            <SimplePageTitle
                pageType="show"
                crName={CR_MINIO_POLICIES}
                crId={record.spec.name}
            />
            <Show actions={false}>
                <TopToolbar>
                    <InspectButton/>
                    {hasPermission('write') && <EditButton/>}
                    <ListButton resource={CR_MINIO_BUCKETS}/>
                </TopToolbar>
                <SimpleShowLayout>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <Labeled>
                            <TextField source="spec.name" />
                            </Labeled>
                        </Grid>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={8}>
                            <AceEditor
                                value={record.spec.content}
                                mode="json"
                                theme="monokai"
                                wrapEnabled
                                width={'100%'}
                                setOptions={{readOnly: true, useWorker: false}}
                            />
                        </Grid>
                    </Grid>
  

                </SimpleShowLayout>
            </Show>
        </>
    );
};

const CustomView: View = {
    key: CR_MINIO_POLICIES,
    name: 'S3',
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
    icon: FolderDeleteIcon,
};

export default CustomView;
