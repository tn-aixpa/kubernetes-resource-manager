import React from 'react';
import {
    Button,
    Datagrid,
    FunctionField,
    List,
    Loading,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    useGetManyReference,
    useShowController,
    useTranslate,
} from 'react-admin';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const CrdList = () => (
    <List actions={false}>
        <Datagrid bulkActionButtons={false}>
            <TextField source="spec.names.kind" label="Name" />
            <ShowButton />
        </Datagrid>
    </List>
);

export const CrdShow = () => (
    <Show>
        <SimpleShowLayout>
            <FunctionField render={(record: any) => JSON.stringify(record)} />
            <RelatedResources />
        </SimpleShowLayout>
    </Show>
);

const RelatedResources = () => {
    const { record } = useShowController();
    const translate = useTranslate();

    const sort = { field: 'id', order: 'ASC' };
    const { data, total, isLoading } = useGetManyReference('crs', {
        target: 'crdId',
        id: record.id,
        pagination: { page: 1, perPage: 10 },
        sort: sort,
    });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return total ? (
        <>
            <Datagrid
                data={data}
                total={total}
                isLoading={isLoading}
                bulkActionButtons={false}
                sort={sort}
            >
                <TextField source="id" />
                <TextField source="version" />
                <TextField source="schema" />
                <ShowButton />
            </Datagrid>
            <Button
                label={translate('pages.crd.show.listCrs')}
                startIcon={<VisibilityIcon />}
                href={`${window.location.origin}/${record.id}`}
            ></Button>
        </>
    ) : (
        <Button
            label={translate('pages.crd.show.createSchema')}
            href={`${window.location.origin}/crs/create?crdId=${record.id}`}
        ></Button>
    );
};
