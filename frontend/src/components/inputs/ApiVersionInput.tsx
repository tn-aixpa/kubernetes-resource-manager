import { TextInput, useGetOne, Loading } from 'react-admin';
import { CrdProps } from '../CrdProps';

const ApiVersionInput = ({ crdId }: CrdProps) => {
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    const group = data.spec.group;
    const storedVersion = data.spec.versions.filter(
        (version: any) => version.storage
    )[0];
    const apiVersion = `${group}/${storedVersion.name}`;
    return (
        <TextInput
            source="apiVersion"
            defaultValue={apiVersion}
            sx={{ width: '22em' }}
            disabled
        />
    );
};

export default ApiVersionInput;
