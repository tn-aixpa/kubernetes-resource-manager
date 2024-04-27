import {
    Datagrid,
    EditButton,
    List,
    ShowButton,
    TextField,
    Show,
    SimpleShowLayout,
    DeleteWithConfirmButton,
    useShowController,
    Create,
    SimpleForm,
    TextInput,
    required,
    Edit,
    useEditController,
    useGetList,
    Loading,
    useTranslate,
    SortPayload,
    NumberInput,
    NumberField,
    ReferenceArrayField,
    CreateButton,
    TopToolbar,
} from 'react-admin';
import { View } from '../index';
import { ViewToolbar } from '../../components/ViewToolbar';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../../components/toolbars';
import { SimplePageTitle } from '../cr';
import { Box, Grid } from '@mui/material';
import { useCrTransform } from '../../hooks/useCrTransform';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { Breadcrumb } from '@dslab/ra-breadcrumb';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { CR_MINIO_USERS } from './cr.users.minio.scc-digitalhub.github.io';
import { CR_MINIO_POLICIES } from './cr.policies.minio.scc-digitalhub.github.io';

export const CR_MINIO_BUCKETS = 'buckets.minio.scc-digitalhub.github.io';

const validateData = (values: any) => {
    const errors: any = {};

    if (values.spec.quota && values.spec.quota < 0) {
        errors['spec.quota'] = `resources.${CR_MINIO_BUCKETS}.errors.quota`;
    }

    return errors;    
}

const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const translate = useTranslate();

    const transform = (data: any) => {
        if (!data.spec.quota) {
            delete data.spec.quota
        }
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

        return validateData(values);
    };

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="create" crName={CR_MINIO_BUCKETS} />
            <Create
                redirect="list"
                actions={<CreateTopToolbar />}
                transform={transform}
            >
                <SimpleForm validate={validate}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="metadata.name" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.name" validate={required()} 
                                helperText={`resources.${CR_MINIO_BUCKETS}.fields.spec.nameHint`}/>
                        </Grid>
                        <Grid item xs={4}>
                            <NumberInput fullWidth source="spec.quota" 
                                helperText={`resources.${CR_MINIO_BUCKETS}.fields.spec.quotaHint`}/>
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

    const transform = (data: any) => {
        if (!data.spec.quota) {
            delete data.spec.quota
        }
        return data;
    };

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="edit"
                crName={CR_MINIO_BUCKETS}
                crId={record.spec.database}
            />
            <Edit actions={<EditTopToolbar hasYaml/>} transform={transform}>
                <SimpleForm toolbar={<ViewToolbar />}  validate={validateData} >
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="metadata.name" disabled validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.name" validate={required()} 
                                helperText={`resources.${CR_MINIO_BUCKETS}.fields.spec.nameHint`}/>
                        </Grid>
                        <Grid item xs={4}>
                            <NumberInput fullWidth source="spec.quota" 
                                helperText={`resources.${CR_MINIO_BUCKETS}.fields.spec.quotaHint`}/>
                        </Grid>
                    </Grid>

                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    const translate = useTranslate();

    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Breadcrumb />
            <Tabs onChange={handleChange} value={value}>
                <Tab label={translate(`resources.${CR_MINIO_BUCKETS}.name`, { smart_count: 2 })}  />
                <Tab label={translate(`resources.${CR_MINIO_USERS}.name`, { smart_count: 2 })}  />
                <Tab label={translate(`resources.${CR_MINIO_POLICIES}.name`, { smart_count: 2 })}  />
            </Tabs>
            <S3TabPanel value={value} index={0}>
                <SimplePageTitle pageType="list" crName={CR_MINIO_BUCKETS} />
                <List actions={<ListTopToolbar />}>
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="spec.name" />
                        <NumberField source="spec.quota" />
                        <Box textAlign={'right'}>
                            <EditButton />
                            <ShowButton />
                            <DeleteWithConfirmButton />
                        </Box>
                    </Datagrid>
                </List>
            </S3TabPanel>
            <S3TabPanel value={value} index={1}>
                <S3Users/>
            </S3TabPanel>
            <S3TabPanel value={value} index={2}>
                <S3Policies/>
            </S3TabPanel>

            
        </>
    );
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
function S3TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
}


const S3Users = () => {
    const sort : SortPayload = { field: 'id', order: 'ASC' };
    const { data, total, isLoading } = useGetList(CR_MINIO_USERS, {
        pagination: { page: 1, perPage: 1000 },
        sort: sort,
    });

    if (isLoading) return <Loading />;
    if (!data) return null;


    return (
        <>
            <SimplePageTitle pageType="list" crName={CR_MINIO_USERS} />
            {data.length > 0 && (
                <>
                <TopToolbar>
                <CreateButton resource={CR_MINIO_USERS}></CreateButton>
                </TopToolbar>
                <Datagrid
                    data={data}
                    total={total}
                    isLoading={isLoading}
                    sort={sort}
                >
                    <TextField source="id" />
                    <TextField source="spec.accessKey" />
                    <ReferenceArrayField source="spec.policies" perPage={1000} reference='policies.minio.scc-digitalhub.github.io'/>

                    <Box textAlign={'right'}>
                        <EditButton resource={CR_MINIO_USERS} />
                        <ShowButton resource={CR_MINIO_USERS} />
                        <DeleteWithConfirmButton
                            redirect={false}
                            resource={CR_MINIO_USERS}/>
                    </Box>
                </Datagrid>
                </>
            )}
        </>
    );
};

const S3Policies = () => {
    const sort : SortPayload = { field: 'id', order: 'ASC' };
    const { data, total, isLoading } = useGetList(CR_MINIO_POLICIES, {
        pagination: { page: 1, perPage: 1000 },
        sort: sort,
    });

    if (isLoading) return <Loading />;
    if (!data) return null;


    return (
        <>
            <SimplePageTitle pageType="list" crName={CR_MINIO_POLICIES} />
            {data.length > 0 && (
                <>
                <TopToolbar>
                <CreateButton resource={CR_MINIO_POLICIES}></CreateButton>
                </TopToolbar>
                <Datagrid
                    data={data}
                    total={total}
                    isLoading={isLoading}
                    sort={sort}
                >
                    <TextField source="id" />
                    <TextField source="spec.name" />

                    <Box textAlign={'right'}>
                        <EditButton resource={CR_MINIO_POLICIES} />
                        <ShowButton resource={CR_MINIO_POLICIES} />
                        <DeleteWithConfirmButton
                            redirect={false}
                            resource={CR_MINIO_POLICIES}/>
                    </Box>
                </Datagrid>
                </>
            )}
        </>
    );
};

const CrShow = () => {
    const { record } = useShowController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="show"
                crName={CR_MINIO_BUCKETS}
                crId={record.spec.name}
            />
            <Show actions={<ShowTopToolbar hasYaml />}>
                <SimpleShowLayout>
                    <TextField source="spec.name" />
                    <TextField source="spec.quota" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const CustomView: View = {
    key: CR_MINIO_BUCKETS,
    name: 'S3',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
    icon: FolderDeleteIcon,
};

export default CustomView;
