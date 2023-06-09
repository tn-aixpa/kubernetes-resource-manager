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

const CR_NUCLIO_APIGATEWAYS = 'nuclioapigateways.nuclio.io';

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
    // TODO test basic > fill fields > none
    // TODO at least 1 upstream
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
                    <TextInput source="spec.description" />
                    <TextInput source="spec.path" validate={required()} />
                    <ArrayInput source="spec.upstreams">
                        <SimpleFormIterator inline>
                            <TextInput source="kind" validate={required()} />
                            <TextInput
                                source="nucliofunction.name"
                                validate={required()}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                    <SelectInput
                        source="spec.authenticationMode"
                        choices={[
                            { id: 'none', name: 'None' },
                            { id: 'basicAuth', name: 'Basic' },
                        ]}
                        validate={required()}
                    />
                    <FormDataConsumer>
                        {({ formData, ...rest }) =>
                            formData.spec?.authenticationMode &&
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
                            )
                        }
                    </FormDataConsumer>
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
            <Breadcrumb />
            <SimplePageTitle pageType="edit" crName={CR_NUCLIO_APIGATEWAYS} />
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<ViewToolbar />}>
                    <TextInput source="spec.host" validate={required()} />
                    <TextInput source="spec.name" validate={required()} />
                    <TextInput source="spec.description" />
                    <TextInput source="spec.path" validate={required()} />
                    <ArrayInput source="spec.upstreams">
                        <SimpleFormIterator inline>
                            <TextInput source="kind" validate={required()} />
                            <TextInput
                                source="nucliofunction.name"
                                validate={required()}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                    <SelectInput
                        source="spec.authenticationMode"
                        choices={[
                            { id: 'none', name: 'None' },
                            { id: 'basicAuth', name: 'Basic' },
                        ]}
                        validate={required()}
                    />
                    <FormDataConsumer>
                        {({ formData, ...rest }) =>
                            formData.spec?.authenticationMode &&
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
                            )
                        }
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
            <SimplePageTitle pageType="show" crName={CR_NUCLIO_APIGATEWAYS} />
            <Show actions={<ShowTopToolbar />}>
                <SimpleShowLayout>
                    <TextField source="spec.host" />
                    <TextField source="spec.name" />
                    <TextField source="spec.description" />
                    <TextField source="spec.path" />
                    <ArrayField source="spec.upstreams">
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
                    <TextField source="spec.authenticationMode" />
                    {record.spec.authenticationMode === 'basicAuth' && (
                        <TextField source="spec.authentication.basicAuth.username" />
                    )}
                    {record.spec.authenticationMode === 'basicAuth' && (
                        <TextField source="spec.authentication.basicAuth.password" />
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
