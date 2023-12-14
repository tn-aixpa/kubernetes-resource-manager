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
    BooleanInput,
    Edit,
    useEditController,
    useTranslate,
    FormDataConsumer,
    AutocompleteArrayInput,
    ArrayField,
    SingleFieldList,
    ChipField,
    NumberInput,
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
import { Box, Grid, Typography } from '@mui/material';
import { useCrTransform } from '../../hooks/useCrTransform';
import { Breadcrumb } from '@dslab/ra-breadcrumb';
import { NetworkPing } from '@mui/icons-material';

export const CR_DREMIOREST = 'dremiorestservers.operator.dremiorestserver.com';

const validateData = (values: any) => {
    const errors: any = {};
    if (!values.metadata.name) {
        errors['metadata.name'] =  'ra.validation.required';
    }
    if (!values.tables || values.tables.length === 0) {
        errors['tables'] = 'ra.validation.required';
    }  
    values.connection = values.connection || {};
    if (!values.spec.connection.host) {
        errors['spec.connection.host'] = 'ra.validation.required';
    }
    if (values.existingSecret) {
        if (!values.spec.connection.secretName) {
            errors['spec.connection.secretName'] = 'ra.validation.required';
        }
    } else {
        if (!values.spec.connection.user) {
            errors['spec.connection.user'] = 'ra.validation.required';
        }
        if (!values.spec.connection.password) {
            errors['spec.connection.password'] = 'ra.validation.required';
        }
    }
    return errors;
}

const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const translate = useTranslate();

    const tables: any[] = [];
   
    const transform = (data: any) => {
        if (data.existingSecret) {
            delete data.spec.connection.user;
            delete data.spec.connection.password;
        } else {
            delete data.spec.secretName;
        }
        data.spec.tables = data.tables.filter((t: any) => !!t).join(',');
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
            <SimplePageTitle pageType="create" crName={CR_DREMIOREST} />
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
                                    <AutocompleteArrayInput 
                                        source='tables'
                                        choices={tables}
                                        validate={required()} 
                                        onCreate={(n) => {
                                            const t = {id: n?.trim(), name: n?.trim()}
                                            if (n?.trim()) {
                                                tables.push(t);
                                                return t;
                                            }
                                            return null;
                                        }}
                                    />
                                </Grid>

                    </Grid>
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_DREMIOREST}.fields.spec.connection.title`
                        )}
                    </Typography>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.connection.host" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <NumberInput fullWidth source="spec.connection.port"/>
                        </Grid>
                        <Grid item xs={4}>
                            <BooleanInput source="existingSecret" />
                        </Grid>
                    </Grid>
                    <FormDataConsumer>                            
                    {({ formData, ...rest }) => (
                    <>
                        {formData.existingSecret && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <TextInput fullWidth source="spec.connection.secretName"  validate={required()}/>
                                </Grid>
                            </Grid>
                        )}
                        {!formData.existingSecret && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <TextInput fullWidth source="spec.connection.user"  validate={required()}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextInput type='password' fullWidth source="spec.connection.password"  validate={required()}/>
                                </Grid>
                            </Grid>
                        )}
                    </>
                    )}
                    </FormDataConsumer>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={8}>
                            <TextInput fullWidth source="spec.connection.jdbcProperties"/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={8}>
                            <TextInput fullWidth source="spec.javaOptions"/>
                        </Grid>
                    </Grid>

                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const translate = useTranslate();
    const { record } = useEditController();
    if (!record) return null;

    const tables = record.spec.tables ? record.spec.tables.split(',').map((t: any) => ({id: t, name: t})) : [];
    record.existing = !!record.spec.anonRole;
    record.existingSecret = !!record.spec.connection.secretName;
    record.tables = record.spec.tables ? record.spec.tables.split(',') : [];

    const transform = (data: any) => {
        data.spec.tables = data.tables.filter((t: any) => !!t).join(',');
        if (data.existingSecret) {
            delete data.spec.connection.user;
            delete data.spec.connection.password;
        } else {
            delete data.spec.secretName;
        }

        return data;

    };
    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="edit"
                crName={CR_DREMIOREST}
                crId={record.spec.database}
            />
            <Edit actions={<EditTopToolbar hasYaml />} transform={transform}>
                <SimpleForm toolbar={<ViewToolbar />} validate={validateData}>
                <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="metadata.name" disabled validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                                    <AutocompleteArrayInput 
                                        source='tables'
                                        choices={tables}
                                        validate={required()} 
                                        onCreate={(n) => {
                                            const t = {id: n?.trim(), name: n?.trim()}
                                            if (n?.trim()) {
                                                tables.push(t);
                                                return t;
                                            }
                                            return null;
                                        }}
                                    />
                                </Grid>

                    </Grid>
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_DREMIOREST}.fields.spec.connection.title`
                        )}
                    </Typography>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.connection.host" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <NumberInput fullWidth source="spec.connection.port"/>
                        </Grid>
                        <Grid item xs={4}>
                            <BooleanInput source="existingSecret" />
                        </Grid>
                    </Grid>
                    <FormDataConsumer>                            
                    {({ formData, ...rest }) => (
                    <>
                        {formData.existingSecret && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <TextInput fullWidth source="spec.connection.secretName"  validate={required()}/>
                                </Grid>
                            </Grid>
                        )}
                        {!formData.existingSecret && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <TextInput fullWidth source="spec.connection.user"  validate={required()}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextInput type='password' fullWidth source="spec.connection.password"  validate={required()}/>
                                </Grid>
                            </Grid>
                        )}
                    </>
                    )}
                    </FormDataConsumer>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={8}>
                            <TextInput fullWidth source="spec.connection.jdbcProperties"/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={8}>
                            <TextInput fullWidth source="spec.javaOptions"/>
                        </Grid>
                    </Grid>
                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="list" crName={CR_DREMIOREST} />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.tables" />
                    <Box textAlign={'right'}>
                        <EditButton />
                        <ShowButton />
                        <DeleteWithConfirmButton />
                    </Box>
                </Datagrid>
            </List>
        </>
    );
};

const CrShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="show"
                crName={CR_DREMIOREST}
                crId={record.spec.database}
            />
            <Show actions={<ShowTopToolbar hasYaml />}>
                <SimpleShowLayout>
                <TextField source="id" />
                <ArrayField label={`resources.${CR_DREMIOREST}.fields.tables`} source="tlabels" record={{
                         tlabels: record.spec.tables ? record.spec.tables.split(',').map((t: any) => ({name: t})) : []    
                    }}>
                         <SingleFieldList linkType={false}>
                            <ChipField source="name" size="small" />
                        </SingleFieldList>
                    </ArrayField>
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_DREMIOREST}.fields.spec.connection.title`
                        )}
                    </Typography>
                    <TextField source="spec.connection.host" />
                    <TextField source="spec.connection.port" />
                    <TextField source="spec.connection.secretName" />
                    <TextField source="spec.connection.user" />
                    <TextField source="spec.connection.password" />
                    <TextField source="spec.connection.jdbcProperties" />
                    <TextField source="spec.javaOptions" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};


const CustomView: View = {
    key: CR_DREMIOREST,
    name: 'Dremio REST',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
    icon: NetworkPing,
};

export default CustomView;
