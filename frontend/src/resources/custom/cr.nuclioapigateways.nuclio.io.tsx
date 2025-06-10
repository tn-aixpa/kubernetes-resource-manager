// SPDX-License-Identifier: Apache-2.0
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
    ArrayInput,
    SimpleFormIterator,
    ArrayField,
    SelectInput,
    FormDataConsumer,
    useTranslate,
    BooleanInput,
    useGetList,
    ReferenceInput,
    usePermissions,
} from 'react-admin';
import { ViewToolbar } from '../../components/ViewToolbar';
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
import { useEffect, useState } from 'react';
import CableIcon from '@mui/icons-material/Cable';
import { Breadcrumb } from '@dslab/ra-breadcrumb';

const CR_NUCLIO_APIGATEWAYS = 'nuclioapigateways.nuclio.io';

type Upstream = {
    [nucliofunctionOrService: string]: { name: string };
} & {
    kind: string;
    id?: string;
};

const getExistingUpstreams = (data: any[] | undefined) => {
    if (!data) {
        return [];
    }
    let upstreams: Upstream[] = [];
    data.forEach(value => {
        value.spec.upstreams.forEach((upstream: Upstream) => {
            const hasSome = upstreams.some((u: Upstream) => {
                type ObjectKey = keyof Upstream;
                const nucliofunctionOrService = u.kind as ObjectKey;
                return (
                    u.kind === upstream.kind &&
                    u[nucliofunctionOrService]?.name ===
                        upstream[nucliofunctionOrService]?.name
                );
            });
            if (!hasSome) {
                upstream.id = value.id;
                upstreams.push(upstream);
            }
        });
    });
    return upstreams;
};

const Upstreams = () => {
    return (
        <FormDataConsumer>
            {({ formData, ...rest }) => (
                <ArrayInput fullWidth
                    source="spec.upstreams"
                    validate={required()}
                    label={false}
                >
                    <SimpleFormIterator
                        inline
                        disableAdd={
                            formData.spec?.upstreams &&
                            formData.spec.upstreams.length > 0
                        }
                    >
                        <SelectInput
                            source="kind"
                            choices={[
                                {
                                    id: 'nucliofunction',
                                    name: 'Nuclio function',
                                },
                                { id: 'service', name: 'Service' },
                            ]}
                            validate={required()}
                        />
                        <FormDataConsumer>
                            {({
                                formData,
                                scopedFormData,
                                getSource,
                                ...rest
                            }) => (
                                <>
                                    {scopedFormData?.kind &&
                                        scopedFormData.kind ===
                                            'nucliofunction' &&
                                        getSource && (
                                            <TextInput
                                                source={getSource(
                                                    'nucliofunction.name'
                                                )}
                                                validate={required()}
                                                sx={{'min-width': '300px'}}
                                            />
                                        )}
                                    {scopedFormData?.kind &&
                                        scopedFormData.kind === 'service' &&
                                        getSource && (
                                            <ReferenceInput
                                                source={getSource(
                                                    'service.name'
                                                )}
                                                fullWidth perPage={1000}
                                                reference='k8s_service'
                                                validate={required()}
                                            />
                                        )}
                                </>
                            )}
                        </FormDataConsumer>
                    </SimpleFormIterator>
                </ArrayInput>
            )}
        </FormDataConsumer>
    );
};

/********************** CRUD components **********************/

const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const translate = useTranslate();

    const [upstreams, setUpstreams] = useState<Upstream[]>([]);
    const { data } = useGetList(CR_NUCLIO_APIGATEWAYS, {
        pagination: { page: 1, perPage: 1000 },
    });

    useEffect(() => {
        const existingUpstreams = getExistingUpstreams(data);
        if (existingUpstreams.length > 0) {
            setUpstreams(existingUpstreams);
        }
    }, [data]);

    const transform = (data: any) => {
        if (data.spec.authenticationMode === 'none') {
            delete data.spec.authentication;
        }

        return {
            ...data,
            apiVersion: apiVersion,
            kind: kind,
            status: {
                name: data.spec.name,
                state: '',
            },
        };
    };

    const validate = (values: any) => {
        if (!apiVersion || !kind) {
            return {
                apiVersion: 'ra.validation.required',
                kind: 'ra.validation.required',
            };
        }

        if (values.spec.upstreams.length < 1) {
            return {
                'spec.upstreams': 'ra.validation.required',
            };
        }

        const hasSome = upstreams.some((u: Upstream) => {
            type ObjectKey = keyof Upstream;
            const nucliofunctionOrService = u.kind as ObjectKey;
            return (
                values.spec.upstreams[0].kind === u.kind &&
                u[nucliofunctionOrService]?.name ===
                    values.spec.upstreams[0][nucliofunctionOrService]?.name
            );
        });
        if (hasSome) {
            return {
                'spec.upstreams': translate(
                    `resources.${CR_NUCLIO_APIGATEWAYS}.alreadyExists`
                ),
            };
        }

        return {};
    };

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="create" crName={CR_NUCLIO_APIGATEWAYS} />
            <Create
                redirect="list"
                actions={<CreateTopToolbar />}
                transform={transform}
            >
                <SimpleForm validate={validate}>
                    <Grid container  spacing={2}>
                        <Grid item xs={2}>
                            <TextInput fullWidth source="metadata.name" validate={required()} />
                         </Grid>
                         <Grid item xs={2}>
                            <TextInput fullWidth source="spec.name" validate={required()} />
                         </Grid>
                        <Grid item xs={5}>
                            <TextInput fullWidth source="spec.host" validate={required()} />
                        </Grid> 
                        <Grid item xs={3}>
                            <TextInput fullWidth source="spec.path" validate={required()} />
                        </Grid> 

                        <Grid item xs={12}>
                            <TextInput source="spec.description" fullWidth />
                        </Grid>
                    </Grid>   
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.fields.spec.upstreams`
                        )}
                    </Typography>
                    <Upstreams />

                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.authenticationTitle`
                        )}
                    </Typography>

                    <Grid container  spacing={2}>
                        <Grid item xs={2}>
                            <SelectInput fullWidth
                                source="spec.authenticationMode"
                                choices={[
                                    { id: 'none', name: 'None' },
                                    { id: 'basicAuth', name: 'Basic' },
                                    { id: 'oauth2', name: 'OAuth2' },
                                    { id: 'jwtAuth', name: 'JWT' },
                                ]}
                                validate={required()}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <FormDataConsumer>
                            {({ formData, ...rest }) => (
                                <>
                                    {formData.spec?.authenticationMode &&
                                        formData.spec?.authenticationMode ===
                                            'basicAuth' && (
                                            <Grid container spacing={2}>
                                                <Grid item xs={3}>
                                                    <TextInput fullWidth
                                                        source="spec.authentication.basicAuth.username"
                                                        validate={required()}
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextInput fullWidth
                                                        source="spec.authentication.basicAuth.password"
                                                        validate={required()}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    {formData.spec?.authenticationMode &&
                                        formData.spec?.authenticationMode ===
                                            'oauth2' && (
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item xs={6}>
                                                    <TextInput fullWidth source="spec.authentication.dexAuth.oauth2ProxyUrl" />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <BooleanInput fullWidth source="spec.authentication.dexAuth.redirectUnauthorizedToSignIn" />
                                                </Grid>
                                            </Grid>
                                        )}
                                    {formData.spec?.authenticationMode &&
                                        formData.spec?.authenticationMode ===
                                            'jwtAuth' && (
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item xs={6}>
                                                        <TextInput fullWidth
                                                            source="spec.authentication.jwtAuth.audience"
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

                </SimpleForm>
            </Create>
        </>
    );
};

const CrEdit = () => {
    const translate = useTranslate();
    const { record } = useEditController();

    const [upstreams, setUpstreams] = useState<Upstream[]>([]);
    const { data } = useGetList(CR_NUCLIO_APIGATEWAYS, {
        pagination: { page: 1, perPage: 1000 },
    });

    useEffect(() => {
        const existingUpstreams = getExistingUpstreams(data);
        if (existingUpstreams.length > 0) {
            setUpstreams(existingUpstreams);
        }
    }, [data]);

    if (!record) return null;

    const transform = (data: any) => {
        if (data.spec.authenticationMode === 'none') {
            delete data.spec.authentication;
        }

        return {
            ...data,
            status: {
                name: data.spec.name,
                state: '',
            },
        };
    };

    const validate = (values: any) => {
        if (values.spec.upstreams.length < 1) {
            return {
                'spec.upstreams': 'ra.validation.required',
            };
        }

        const hasSome = upstreams.some((u: Upstream) => {
            type ObjectKey = keyof Upstream;
            const nucliofunctionOrService = u.kind as ObjectKey;
            return (
                values.id !== u.id &&
                values.spec.upstreams[0].kind === u.kind &&
                u[nucliofunctionOrService]?.name ===
                    values.spec.upstreams[0][nucliofunctionOrService]?.name
            );
        });
        if (hasSome) {
            return {
                'spec.upstreams': translate(
                    `resources.${CR_NUCLIO_APIGATEWAYS}.alreadyExists`
                ),
            };
        }

        return {};
    };

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="edit" crName={CR_NUCLIO_APIGATEWAYS} />
            <Edit actions={<EditTopToolbar hasYaml />} transform={transform} mutationMode='pessimistic'>
                <SimpleForm toolbar={<ViewToolbar />} validate={validate}>
                    <Grid container  spacing={2}>
                        <Grid item xs={2}>
                            <TextInput fullWidth disabled source="metadata.name" validate={required()} />
                         </Grid>
                         <Grid item xs={2}>
                            <TextInput fullWidth source="spec.name" validate={required()} />
                         </Grid>
                        <Grid item xs={5}>
                            <TextInput fullWidth source="spec.host" validate={required()} />
                        </Grid> 
                        <Grid item xs={3}>
                            <TextInput fullWidth source="spec.path" validate={required()} />
                        </Grid> 

                        <Grid item xs={12}>
                            <TextInput source="spec.description" fullWidth />
                        </Grid>
                    </Grid>  

                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.fields.spec.upstreams`
                        )}
                    </Typography>
                    <Upstreams />
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.authenticationTitle`
                        )}
                    </Typography>
                    <Grid container  spacing={2}>
                        <Grid item xs={2}>
                            <SelectInput fullWidth
                                source="spec.authenticationMode"
                                choices={[
                                    { id: 'none', name: 'None' },
                                    { id: 'basicAuth', name: 'Basic' },
                                    { id: 'oauth2', name: 'OAuth2' },
                                    { id: 'jwtAuth', name: 'JWT' },
                                ]}
                                validate={required()}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <FormDataConsumer>
                            
                                {({ formData, ...rest }) => (
                                    <>
                                        {formData.spec?.authenticationMode &&
                                            formData.spec?.authenticationMode ===
                                                'basicAuth' && (
                                                <Grid container spacing={2}>
                                                    <Grid item xs={3}>
                                                        <TextInput fullWidth
                                                        source="spec.authentication.basicAuth.username"
                                                        validate={required()}
                                                    />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextInput fullWidth
                                                            source="spec.authentication.basicAuth.password"
                                                            validate={required()}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                        {formData.spec?.authenticationMode &&
                                            formData.spec?.authenticationMode ===
                                                'oauth2' && (
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item xs={6}>
                                                        <TextInput fullWidth source="spec.authentication.dexAuth.oauth2ProxyUrl" />
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <BooleanInput fullWidth source="spec.authentication.dexAuth.redirectUnauthorizedToSignIn" />
                                                    </Grid>
                                                </Grid>

                                            )}
                                        {formData.spec?.authenticationMode &&
                                            formData.spec?.authenticationMode ===
                                                'jwtAuth' && (
                                            <Grid container alignItems="center" spacing={2}>
                                                <Grid item xs={6}>
                                                    <TextInput fullWidth
                                                        source="spec.authentication.jwtAuth.audience"
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
                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_NUCLIO_APIGATEWAYS, op)

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="list" crName={CR_NUCLIO_APIGATEWAYS} />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.name" />
                    <TextField source="spec.host" />
                    <TextField source="spec.path" />
                    <TextField source="status.state" />
                    <Box textAlign={'right'}>
                        {hasPermission('write') && <EditButton />}
                        {hasPermission('read') && <ShowButton />}
                        {hasPermission('write') && <DeleteWithConfirmButton />}
                    </Box>
                </Datagrid>
            </List>
        </>
    );
};

const CrShow = () => {
    const translate = useTranslate();
    const { record } = useShowController();
    const { permissions } = usePermissions();
    const hasPermission = (op: string) => permissions && permissions.canAccess(CR_NUCLIO_APIGATEWAYS, op)
    if (!record) return null;

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="show" crName={CR_NUCLIO_APIGATEWAYS} />
            <Show actions={<ShowTopToolbar hasYaml hasEdit={hasPermission('write')} hasDelete={hasPermission('write')} />}>
                <SimpleShowLayout>
                    <TextField source="spec.host" />
                    <TextField source="spec.name" />
                    <TextField source="spec.description" />
                    <TextField source="spec.path" />
                    <TextField source="status.state" />
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.fields.spec.upstreams`
                        )}
                    </Typography>
                    <ArrayField source="spec.upstreams" label={false}>
                        <Datagrid bulkActionButtons={false}>
                            <TextField
                                source="kind"
                                label={`resources.${CR_NUCLIO_APIGATEWAYS}.fields.spec.upstreams.kind`}
                            />
                            <TextField
                                source="nucliofunction.name"
                                label={`resources.${CR_NUCLIO_APIGATEWAYS}.fields.spec.upstreams.nucliofunction.name`}
                            />
                        </Datagrid>
                    </ArrayField>
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.authenticationTitle`
                        )}
                    </Typography>
                    <TextField source="spec.authenticationMode" />
                    {record.spec.authenticationMode === 'basicAuth' && (
                        <TextField source="spec.authentication.basicAuth.username" />
                    )}
                    {record.spec.authenticationMode === 'basicAuth' && (
                        <TextField source="spec.authentication.basicAuth.password" />
                    )}
                    {record.spec.authenticationMode === 'oauth2' && (
                        <TextField source="spec.authentication.oauth2.token" />
                    )}
                    {record.spec.authenticationMode === 'apikey' && (
                        <TextField source="spec.authentication.apikey.token" />
                    )}
                    {record.spec.authenticationMode === 'jwtAuth' && (
                        <TextField source="spec.authentication.jwtAuth.audience" />
                    )}
                </SimpleShowLayout>
            </Show>
        </>
    );
};

const CustomView: View = {
    key: CR_NUCLIO_APIGATEWAYS,
    name: 'API Gateways',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
    icon: CableIcon,
};

export default CustomView;
