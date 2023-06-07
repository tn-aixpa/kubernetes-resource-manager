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
    useResourceContext,
    DeleteWithConfirmButton,
    useShowController,
    useEditController,
    ArrayInput,
    SimpleFormIterator,
    ArrayField,
    SelectInput,
    FormDataConsumer,
} from 'react-admin';
import { ViewToolbar } from '../components/ViewToolbar';
import {
    CreateTopToolbar,
    EditTopToolbar,
    ListTopToolbar,
    ShowTopToolbar,
} from '../components/toolbars';
import { ApiVersionInput, KindInput, SimplePageTitle } from './cr';
import { View } from '.';
import Breadcrumb from '../components/Breadcrumb';

const CR_NUCLIO_APIGATEWAYS = 'nuclioapigateways.nuclio.io';

const CrCreate = () => {
    const crdId = useResourceContext();

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="create"
                crName={`${CR_NUCLIO_APIGATEWAYS}.names.singular`}
            />
            <Create redirect="list" actions={<CreateTopToolbar />}>
                <SimpleForm>
                    {crdId && (
                        <ApiVersionInput
                            crdId={crdId}
                            sx={{ display: 'none' }}
                        />
                    )}
                    {crdId && (
                        <KindInput crdId={crdId} sx={{ display: 'none' }} />
                    )}
                    <TextInput source="metadata.name" validate={required()} />
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
            <SimplePageTitle
                pageType="edit"
                crName={`${CR_NUCLIO_APIGATEWAYS}.names.singular`}
            />
            <Edit actions={<EditTopToolbar />}>
                <SimpleForm toolbar={<ViewToolbar />}>
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
                </SimpleForm>
            </Edit>
        </>
    );
};

const CrList = () => {
    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="list"
                crName={`${CR_NUCLIO_APIGATEWAYS}.names.plural`}
            />
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
    console.log(record);

    return (
        <>
            <Breadcrumb />
            <SimplePageTitle
                pageType="show"
                crName={`${CR_NUCLIO_APIGATEWAYS}.names.singular`}
            />
            <Show actions={<ShowTopToolbar />}>
                <SimpleShowLayout>
                    <TextField source="spec.authenticationMode" />
                    {record.spec.authenticationMode === 'basicAuth' && (
                        <TextField source="spec.authentication.basicAuth.username" />
                    )}
                    {record.spec.authenticationMode === 'basicAuth' && (
                        <TextField source="spec.authentication.basicAuth.password" />
                    )}
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
