import { useEffect, useState } from 'react';
import { useGetOne, useResourceContext } from 'react-admin';

export const useGetCrdJsonSchema = () => {
    const crdId = useResourceContext();
    const [jsonSchema, setJsonSchema] = useState<string>('');
    const { data } = useGetOne('crd', { id: crdId });

    useEffect(() => {
        if (data && data.spec) {
            console.log(data.spec);
            const storedVersion = data.spec.versions.filter(
                (version: any) => version.storage
            )[0];

            setJsonSchema(storedVersion?.schema?.openAPIV3Schema?.properties?.spec);
        }
    }, [data]);

    return { jsonSchema };
}