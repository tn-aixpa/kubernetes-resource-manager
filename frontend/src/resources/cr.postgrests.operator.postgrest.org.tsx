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
    BooleanField,
    Create,
    SimpleForm,
    TextInput,
    required,
    BooleanInput,
    Edit,
    useEditController,
    useTranslate,
    FormDataConsumer,
    SelectArrayInput,
    AutocompleteArrayInput,
    ArrayField,
    SingleFieldList,
    ChipField,
} from 'react-admin';
import { View } from './index';
import { ViewToolbar } from '../components/ViewToolbar';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { SimplePageTitle } from './cr';
import { Grid } from '@mui/material';
import { useCrTransform } from '../hooks/useCrTransform';
import { Breadcrumb } from '@dslab/ra-breadcrumb';
import { NetworkPing } from '@mui/icons-material';

export const CR_POSTGREST = 'postgrests.operator.postgrest.org';

const validateData = (values: any) => {
    const errors: any = {};
    if (!values.metadata.name) {
        errors['metadata.name'] =  'ra.validation.required';
    }
    if (!values.spec.schemas) {
        errors['spec.schemas'] = 'ra.validation.required';
    }  
    if (values.existing) {
        if (!values.spec.anonRole) {
            errors['spec.anonRole'] = 'ra.validation.required';
        }  
    } else {
        if (!values.tables || values.tables.length === 0) {
            errors['tables'] = 'ra.validation.required';
        }  
        if (!values.grants || values.grants.length === 0) {
            errors['grants'] = 'ra.validation.required';
        }  

    }
    return errors;
}

const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const translate = useTranslate();

    const tables: any[] = [];
   
    const transform = (data: any) => {
        if (data.existing) {
            delete data.spec.tables;
            delete data.spec.grants;
        } else {
            delete data.spec.anonRole;
            data.spec.grants = data.grants.join(',');
            data.spec.tables = data.tables;
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
            <SimplePageTitle pageType="create" crName={CR_POSTGREST} />
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
                            <TextInput fullWidth source="spec.schemas" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <BooleanInput source="existing" />
                        </Grid>
                    </Grid>
                    <FormDataConsumer>                            
                    {({ formData, ...rest }) => (
                    <>
                        {formData.existing && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <TextInput fullWidth source="spec.anonRole"  validate={required()}/>
                                </Grid>
                            </Grid>
                        )}
                        {!formData.existing && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <SelectArrayInput  validate={required()} fullWidth source="grants" choices={[
                                        {id: 'SELECT', name: 'SELECT'},
                                        {id: 'INSERT', name: 'INSERT'},
                                        {id: 'UPDATE', name: 'UPDATE'},
                                        {id: 'DELETE', name: 'DELETE'},
                                    ]} />
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
                        )}
                    </>
                    )}
                    </FormDataConsumer>
                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const { record } = useEditController();
    if (!record) return null;

    const tables = record.spec.tables ? record.spec.tables.map((t: any) => ({id: t, name: t})) : [];
    record.existing = !!record.spec.anonRole;
    record.tables = record.spec.tables;
    record.grants = record.spec.grants ? record.spec.grants.split(',') : [];

    const transform = (data: any) => {
        if (data.existing) {
            delete data.spec.tables;
            delete data.spec.grants;
        } else {
            delete data.spec.anonRole;
            data.spec.grants = data.grants.join(',');
            data.spec.tables = data.tables;
        }
        return data;

    };
    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="edit"
                crName={CR_POSTGREST}
                crId={record.spec.database}
            />
            <Edit actions={<EditTopToolbar hasYaml />} transform={transform}>
                <SimpleForm toolbar={<ViewToolbar />} validate={validateData}>
                <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="metadata.name" disabled validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextInput fullWidth source="spec.schemas" validate={required()} />
                        </Grid>
                        <Grid item xs={4}>
                            <BooleanInput source="existing" />
                        </Grid>
                    </Grid>
                    <FormDataConsumer>                            
                    {({ formData, ...rest }) => (
                    <>
                        {formData.existing && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <TextInput fullWidth source="spec.anonRole"  validate={required()}/>
                                </Grid>
                            </Grid>
                        )}
                        {!formData.existing && (
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={4}>
                                    <SelectArrayInput  validate={required()} fullWidth source="grants" choices={[
                                        {id: 'SELECT', name: 'SELECT'},
                                        {id: 'INSERT', name: 'INSERT'},
                                        {id: 'UPDATE', name: 'UPDATE'},
                                        {id: 'DELETE', name: 'DELETE'},
                                    ]} />
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
                        )}
                    </>
                    )}
                    </FormDataConsumer>
                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="list" crName={CR_POSTGREST} />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.schemas" />
                    <TextField source="spec.anonRole" />
                    <TextField source="spec.grants" />
                    <TextField source="spec.tables" />
                    <EditButton />
                    <ShowButton />
                    <DeleteWithConfirmButton />
                </Datagrid>
            </List>
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
                crName={CR_POSTGREST}
                crId={record.spec.database}
            />
            <Show actions={<ShowTopToolbar hasYaml />}>
                <SimpleShowLayout>
                <TextField source="id" />
                    <TextField source="spec.schemas" />
                    <TextField source="spec.anonRole" />
                    <ArrayField label={`resources.${CR_POSTGREST}.fields.grants`} source="glabels" record={{
                         glabels: record.spec.grants ? record.spec.grants.split(',').map((g: any) => ({name: g})) : []    
                    }}>
                         <SingleFieldList linkType={false}>
                            <ChipField source="name" size="small" />
                        </SingleFieldList>
                    </ArrayField>
                    <ArrayField label={`resources.${CR_POSTGREST}.fields.tables`} source="tlabels" record={{
                         tlabels: record.spec.tables ? record.spec.tables.map((t: any) => ({name: t})) : []    
                    }}>
                         <SingleFieldList linkType={false}>
                            <ChipField source="name" size="small" />
                        </SingleFieldList>
                    </ArrayField>
                </SimpleShowLayout>
            </Show>
        </>
    );
};


const CustomView: View = {
    key: CR_POSTGREST,
    name: 'PostgREST',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
    icon: NetworkPing,
};

export default CustomView;
