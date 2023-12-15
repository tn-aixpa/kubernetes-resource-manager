import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    ShowButton,
    SimpleForm,
    TextField,
    TextInput,
    Show,
    SimpleShowLayout,
    required,
    DeleteWithConfirmButton,
    useShowController,
    useEditController,
    SelectInput,
    FormDataConsumer,
    useTranslate,
    ReferenceInput,
    NumberInput,
    useGetOne,
} from 'react-admin';
import { useFormContext, useWatch } from "react-hook-form";
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../../components/toolbars';
import { SimplePageTitle } from '../cr';
import { View } from '..';
import { useCrTransform } from '../../hooks/useCrTransform';
import { Box, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import CableIcon from '@mui/icons-material/Cable';
import { Breadcrumb } from '@dslab/ra-breadcrumb';

const CR_APIGATEWAYS = 'apigws.operator.scc-digitalhub.github.io';

const validateFields = (values: any) => {
    const res: any = {};
    ['host', 'service', 'path', 'port'].forEach(element => {
       if (!values.spec[element]) {
            res['spec.' + element] = 'ra.validation.required'
       }
    });
    if (!values.spec.auth) values.spec.auth = {};
    if (!values.spec.auth.type ) {
        res['spec.auth.type'] = 'ra.validation.required';
    }
    if (values.spec.auth.type === 'basic') {
        if (!values.spec.auth.basic) values.spec.auth.basic = {};
        if (!values.spec.auth.basic.user) {
            res['spec.auth.basic.user'] = 'ra.validation.required'
        }
        if (!values.spec.auth.basic.password) {
            res['spec.auth.basic.password'] = 'ra.validation.required'
        }
    }
    console.log(values);

    return res;    
}

const PortInput = () => {
    const formContext = useFormContext();
    const service = useWatch({ name: 'spec.service' });
    const { data } = useGetOne('k8s_service', { id: service });
    const serviceObj = data ? data : null;
    useEffect(() => {    
        if (serviceObj && serviceObj.spec && serviceObj.spec.ports && serviceObj.spec.ports.length > 0) {
                formContext.setValue('spec.port', serviceObj.spec.ports[0].port);
        }
    });
  
    return (
      <TextInput source="spec.port" />
    );
  };
  

const ApiGWForm = () => {
    const translate = useTranslate();
    const id  = useWatch({name: 'id'});   

    return (
        <>
            <Grid container  spacing={2}>
                <Grid item xs={6}>
                    <TextInput disabled={!!id} fullWidth source="metadata.name" validate={required()} />
                    </Grid>
                    <Grid item xs={4}>
                    <ReferenceInput reference='k8s_service' fullWidth source="spec.service" validate={required()}/>
                    </Grid>
                    <Grid item xs={2}>
                    <FormDataConsumer>
                    {({ formData, ...rest }) => (
                    <>
                        {formData && formData.spec.service && (<PortInput/>)}
                        {(!formData || !formData.spec.service) && (<NumberInput fullWidth source="spec.port" validate={required()} />)}                                
                    </>
                    )}  
                </FormDataConsumer> 
                    </Grid>
                <Grid item xs={8}>
                    <TextInput fullWidth source="spec.host" validate={required()} />
                </Grid> 
                <Grid item xs={4}>
                    <TextInput fullWidth source="spec.path" validate={required()} />
                </Grid> 
            </Grid>   

            <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                {translate(
                    `resources.${CR_APIGATEWAYS}.authenticationTitle`
                )}
            </Typography>

            <Grid container  spacing={2}>
                <Grid item xs={2}>
                    <SelectInput fullWidth
                        source="spec.auth.type"
                        choices={[
                            { id: 'none', name: 'None' },
                            { id: 'basic', name: 'Basic' },
                        ]}
                        validate={required()}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormDataConsumer>
                    {({ formData, ...rest }) => (
                        <>
                            {formData.spec?.auth &&
                                formData.spec?.auth.type ===
                                    'basic' && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextInput fullWidth
                                                source="spec.auth.basic.user"
                                                validate={required()}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextInput fullWidth
                                                type='password'
                                                source="spec.auth.basic.password"
                                                validate={required()}
                                            />
                                        </Grid>
                                    </Grid>
                                )}

                        </>
                    )}
                    </FormDataConsumer>
                </Grid>
            </Grid>
        </>
    );
}

const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();

    const defaults = () => ({ spec: {path : '/'} });

    const transform = (data: any) => {
        if (data.spec.auth.type === 'none') {
            delete data.spec.auth.basic;
        }
        return {
            ...data,
            apiVersion: apiVersion,
            kind: kind
        };
    };

    const validate = (values: any) => {
        if (!apiVersion || !kind) {
            return {
                apiVersion: 'ra.validation.required',
                kind: 'ra.validation.required',
            };
        }
        return validateFields(values);
    };

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="create" crName={CR_APIGATEWAYS} />
            <Create redirect="list" actions={<CreateTopToolbar />} transform={transform} >
                <SimpleForm validate={validate} defaultValues={defaults}>
                    <ApiGWForm/>
                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const { record } = useEditController();    
    const { apiVersion, kind } = useCrTransform();

    if (!record) return null;

    const transform = (data: any) => {
        if (data.spec.auth.type === 'none') {
            delete data.spec.auth.basic;
        }
        data.status = {state: 'Updating'}
        return {
            ...data,
            apiVersion: apiVersion,
            kind: kind
        };
    };

    const validate = (values: any) => {
        if (!apiVersion || !kind) {
            return {
                apiVersion: 'ra.validation.required',
                kind: 'ra.validation.required',
            };
        }
        return validateFields(values);
    };

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="create" crName={CR_APIGATEWAYS} />
            <Edit redirect="list" actions={<EditTopToolbar />} transform={transform} >
                <SimpleForm validate={validate} >
                    <ApiGWForm/>
                </SimpleForm>
            </Edit>
        </>
    );
}

const CrList = () => {
    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="list" crName={CR_APIGATEWAYS} />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.service" />
                    <TextField source="spec.host" />
                    <TextField source="spec.port" />
                    <TextField source="spec.path" />
                    <TextField source="status.state" />
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
            <SimplePageTitle pageType="show" crName={CR_APIGATEWAYS} />
            <Show actions={<ShowTopToolbar hasYaml />}>
                <SimpleShowLayout>
                    <TextField source="spec.service" />
                    <TextField source="spec.host" />
                    <TextField source="spec.port" />
                    <TextField source="spec.path" />
                    <TextField source="status.state" />
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_APIGATEWAYS}.authenticationTitle`
                        )}
                    </Typography>
                    <TextField source="spec.auth.type" />
                    {record.spec.auth.type === 'basic' && (
                        <TextField source="spec.auth.basic.user" />
                    )}
                    {/* {record.spec.auth.type === 'basic' && (
                        <TextField source="spec.auth.basic.password" />
                    )} */}
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const CustomView: View = {
    key: CR_APIGATEWAYS,
    name: 'API Gateways',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
    icon: CableIcon,
};

export default CustomView;

