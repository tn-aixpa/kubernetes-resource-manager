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
} from 'react-admin';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const CrdList = () => (
    <List>
        <Datagrid bulkActionButtons={false}>
            <TextField source="id" />
            <ShowButton />
        </Datagrid>
    </List>
);

/*
- se abbiamo schema -> mostrare elenco schemi + bottone per elenco CR
- se non abbiamo schema -> mostrare bottone per andare a creare schema
*/

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
        <React.Fragment>
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
            <Button label='List CRs' startIcon={<VisibilityIcon />} href={`${window.location.origin}/${record.id}`}></Button>
        </React.Fragment>
    ) : (
        <Button label='Create schema' href={`${window.location.origin}/crs/create?crdId=${record.id}`}></Button>
    );
};
