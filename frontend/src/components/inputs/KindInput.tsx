import { TextInput, useGetOne, Loading } from 'react-admin';
import { CrdProps } from '../CrdProps';

const KindInput = ({ crdId }: CrdProps) => {
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return (
        <TextInput source="kind" defaultValue={data.spec.names.kind} disabled />
    );
};

export default KindInput