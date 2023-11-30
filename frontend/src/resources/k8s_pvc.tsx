import React from 'react';
import {
    Datagrid,
    List,
    Create,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    SimpleForm,
    TextInput,
    required,
    SelectArrayInput,
    DeleteWithConfirmButton,
    useShowController,
    useTranslate,
    SelectInput,
    ReferenceInput,
    NumberInput,
} from 'react-admin';
import { Grid, Typography } from '@mui/material';
import { Breadcrumb } from '@dslab/ra-breadcrumb';
import {
    CreateTopToolbar,
    ListTopToolbar,
} from '../components/toolbars';

export const K8SPvcCreate = () => {
    const translate = useTranslate();

    const defaultValues = () => ({volumeMode: 'Filesystem'});

    const validate = (values: any) => {
        const errors : any  = {};
        if (!values.name) {
            errors.name = 'ra.validation.required';
        }
        if (!values.resourceAmount) {
            errors.resourceAmount = 'ra.validation.required';
        }
        if (!values.storageClassName) {
            errors.storageClassName = 'ra.validation.required';
        }
        if (!values.accessModes || values.accessModes.length === 0) {
            errors.accessModes = 'ra.validation.required';
        }
        return errors;
    };

    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.create', {
                    name: translate('resources.k8s_pvc.name', {
                        smart_count: 1,
                    }).toLowerCase(),
                })}
            </Typography>
            <Create
                redirect="list"
                actions={<CreateTopToolbar />}
            >
                <SimpleForm noValidate validate={validate} defaultValues={defaultValues}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextInput
                                fullWidth={true}
                                source="name"
                                validate={required()}
                                label={'resources.k8s_pvc.fields.metadata.name'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <NumberInput
                                fullWidth={true}
                                source="resourceAmount"
                                validate={required()}
                                label={'resources.k8s_pvc.fields.spec.resources.requests.storage'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ReferenceInput
                                fullWidth={true}
                                source="storageClassName"
                                reference="k8s_storageclass"
                                validate={required()}
                                label={'resources.k8s_pvc.fields.spec.storageClassName'}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextInput
                                fullWidth={true}
                                source="volumeName"
                                label={'resources.k8s_pvc.fields.spec.volumeName'}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <SelectArrayInput 
                            validate={required()}
                            fullWidth={true}
                            source="accessModes" 
                            label={'resources.k8s_pvc.fields.spec.accessModes'}
                            choices={[
                                {id: 'ReadWriteOnce', name: 'ReadWriteOnce'},
                                {id: 'ReadOnlyMany', name: 'ReadOnlyMany'},
                                {id: 'ReadWriteMany', name: 'ReadWriteMany'},
                                {id: 'ReadWriteOncePod', name: 'ReadWriteOncePod'},
                            ]}/>
                        </Grid>
                        <Grid item xs={3}>
                            <SelectInput 
                            fullWidth={true}
                            source="volumeMode" 
                            label={'resources.k8s_pvc.fields.spec.volumeMode'}
                            choices={[
                                {id: 'Filesystem', name: 'Filesystem'},
                                {id: 'Block', name: 'Block'},
                            ]}/>
                        </Grid>
                    </Grid>
                </SimpleForm>
            </Create>
        </>
    );
};

export const K8SPvcList = () => (
    <>
        <Breadcrumb />
        <List actions={<ListTopToolbar />}>
            <Datagrid bulkActionButtons={false}>
                <TextField source="metadata.name" />
                <TextField source="status.phase" />
                <TextField source="spec.volumeName" />
                <TextField source="spec.resources.requests.storage" />
                <TextField source="spec.storageClassName" />
                <ShowButton />
                <DeleteWithConfirmButton />
            </Datagrid>
        </List>
    </>
);

export const K8SPvcShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    if (!record) return null;
    return (
        <>
            <Breadcrumb />
            <Typography variant="h4" className="page-title">
                {translate('ra.page.show', {
                    name: 'Deployment',
                    recordRepresentation: record.id,
                })}
            </Typography>
            <Show actions={false}>
                <SimpleShowLayout>
                    <TextField source="metadata.name" />
                    <TextField source="status.phase" />
                    <TextField source="spec.volumeName" />
                    <TextField source="spec.resources.requests.storage" />
                    <TextField source="spec.storageClassName" />
                    <TextField source="metadata.creationTimestamp" />
                    <TextField source="metadata.resourceVersion" />
                </SimpleShowLayout>
            </Show>
        </>
    );
};

