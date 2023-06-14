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
} from 'react-admin';
import { ViewToolbar } from '../components/ViewToolbar';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { SimplePageTitle } from './cr';
import { View } from '.';
import Breadcrumb from '../components/Breadcrumb';
import { useCrTransform } from '../hooks/useCrTransform';
import { Typography } from '@mui/material';

const CR_NUCLIO_APIGATEWAYS = 'nuclioapigateways.nuclio.io';

const CrCreate = () => {
    const { apiVersion, kind } = useCrTransform();
    const translate = useTranslate();

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
                state: null,
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
                    <TextInput source="metadata.name" validate={required()} />
                    <TextInput source="spec.host" validate={required()} />
                    <TextInput source="spec.name" validate={required()} />
                    <TextInput source="spec.description" fullWidth />
                    <TextInput source="spec.path" validate={required()} />
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.fields.spec.upstreams`
                        )}
                    </Typography>
                    <FormDataConsumer>
                        {({ formData, ...rest }) => (
                            <ArrayInput
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
                                                {scopedFormData.kind &&
                                                    scopedFormData.kind ===
                                                        'nucliofunction' &&
                                                    getSource && (
                                                        <TextInput
                                                            source={getSource(
                                                                'nucliofunction.name'
                                                            )}
                                                            validate={required()}
                                                        />
                                                    )}
                                                {scopedFormData.kind &&
                                                    scopedFormData.kind ===
                                                        'service' &&
                                                    getSource && (
                                                        <TextInput
                                                            source={getSource(
                                                                'service.name'
                                                            )}
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
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.authenticationTitle`
                        )}
                    </Typography>
                    <SelectInput
                        source="spec.authenticationMode"
                        choices={[
                            { id: 'none', name: 'None' },
                            { id: 'basicAuth', name: 'Basic' },
                            { id: 'oauth2', name: 'OAuth2' },
                            { id: 'apikey', name: 'API key' },
                            { id: 'jwtAuth', name: 'JWT' },
                        ]}
                        validate={required()}
                    />
                    <FormDataConsumer>
                        {({ formData, ...rest }) => (
                            <>
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'basicAuth' && (
                                        <>
                                            <TextInput
                                                source="spec.authentication.basicAuth.username"
                                                validate={required()}
                                            />
                                            <TextInput
                                                source="spec.authentication.basicAuth.password"
                                                validate={required()}
                                            />
                                        </>
                                    )}
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'oauth2' && (
                                        <TextInput
                                            source="spec.authentication.oauth2.token"
                                            validate={required()}
                                        />
                                    )}
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'apikey' && (
                                        <TextInput
                                            source="spec.authentication.apikey.token"
                                            validate={required()}
                                        />
                                    )}
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'jwtAuth' && (
                                        <TextInput
                                            source="spec.authentication.jwtAuth.audience"
                                            validate={required()}
                                        />
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
    const translate = useTranslate();
    const { record } = useEditController();
    if (!record) return null;

    const transform = (data: any) => {
        if (data.spec.authenticationMode === 'none') {
            delete data.spec.authentication;
        }

        return {
            ...data,
            status: {
                name: data.spec.name,
                state: 'provisioning',
            },
        };
    };

    const validate = (values: any) => {
        if (values.spec.upstreams.length < 1) {
            return {
                'spec.upstreams': 'ra.validation.required',
            };
        }

        return {};
    };

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle pageType="edit" crName={CR_NUCLIO_APIGATEWAYS} />
            <Edit actions={<EditTopToolbar hasYaml />} transform={transform}>
                <SimpleForm toolbar={<ViewToolbar />} validate={validate}>
                    <TextInput source="spec.host" validate={required()} />
                    <TextInput source="spec.name" validate={required()} />
                    <TextInput source="spec.description" fullWidth />
                    <TextInput source="spec.path" validate={required()} />
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.fields.spec.upstreams`
                        )}
                    </Typography>
                    <ArrayInput source="spec.upstreams" label={false}>
                        <SimpleFormIterator inline>
                            <TextInput source="kind" validate={required()} />
                            <TextInput
                                source="nucliofunction.name"
                                validate={required()}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                    <Typography variant="h6" sx={{ paddingTop: '20px' }}>
                        {translate(
                            `resources.${CR_NUCLIO_APIGATEWAYS}.authenticationTitle`
                        )}
                    </Typography>
                    <SelectInput
                        source="spec.authenticationMode"
                        choices={[
                            { id: 'none', name: 'None' },
                            { id: 'basicAuth', name: 'Basic' },
                            { id: 'oauth2', name: 'OAuth2' },
                            { id: 'apikey', name: 'API key' },
                            { id: 'jwtAuth', name: 'JWT' },
                        ]}
                        validate={required()}
                    />
                    <FormDataConsumer>
                        {({ formData, ...rest }) => (
                            <>
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'basicAuth' && (
                                        <>
                                            <TextInput
                                                source="spec.authentication.basicAuth.username"
                                                validate={required()}
                                            />
                                            <TextInput
                                                source="spec.authentication.basicAuth.password"
                                                validate={required()}
                                            />
                                        </>
                                    )}
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'oauth2' && (
                                        <TextInput
                                            source="spec.authentication.oauth2.token"
                                            validate={required()}
                                        />
                                    )}
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'apikey' && (
                                        <TextInput
                                            source="spec.authentication.apikey.token"
                                            validate={required()}
                                        />
                                    )}
                                {formData.spec?.authenticationMode &&
                                    formData.spec?.authenticationMode ===
                                        'jwtAuth' && (
                                        <TextInput
                                            source="spec.authentication.jwtAuth.audience"
                                            validate={required()}
                                        />
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
            <SimplePageTitle pageType="list" crName={CR_NUCLIO_APIGATEWAYS} />
            <List actions={<ListTopToolbar />}>
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="spec.name" />
                    <TextField source="spec.host" />
                    <TextField source="spec.path" />
                    <TextField source="status.state" />
                    <EditButton />
                    <ShowButton />
                    <DeleteWithConfirmButton />
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
            <SimplePageTitle pageType="show" crName={CR_NUCLIO_APIGATEWAYS} />
            <Show actions={<ShowTopToolbar hasYaml />}>
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
    name: 'Nuclio API Gateways',
    list: CrList,
    show: CrShow,
    create: CrCreate,
    edit: CrEdit,
};

export default CustomView;
