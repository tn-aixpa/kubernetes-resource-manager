import { SxProps, Theme } from '@mui/material';
import {
    Loading,
    TextInput,
    useChoicesContext,
    useGetOne,
    useResourceContext,
} from 'react-admin';

export const PrecompiledInput = ({ props }: any) => {
    const { availableChoices } = useChoicesContext();
    console.log(props);
    let defaultVal;
    if (availableChoices && availableChoices.length > 0) {
        console.log(availableChoices[0].spec.names.kind);
        defaultVal = availableChoices[0].spec.names.kind;
    }
    if (!defaultVal) {
        return null;
    }

    return <TextInput source="kind" defaultValue={defaultVal} />;
};

export const KindInput = ({ disabled }: InputProps) => {
    const { data, isLoading } = useGetOne('crd', { id: useResourceContext() });
    if (isLoading) return <Loading />;
    if (!data) return null;
    return (
        <TextInput
            source="kind"
            defaultValue={data.spec.names.kind}
            disabled={disabled}
        />
    );
};

export const ApiVersionInput = ({ sx, disabled }: InputProps) => {
    const { data, isLoading } = useGetOne('crd', { id: useResourceContext() });
    if (isLoading) return <Loading />;
    if (!data) return null;
    const group = data.spec.group;
    const storedVersion = data.spec.versions.filter(
        (version: any) => version.storage
    )[0];
    console.log(storedVersion);
    const apiVersion = `${group}/${storedVersion.name}`;
    return (
        <TextInput
            source="apiVersion"
            defaultValue={apiVersion}
            sx={sx}
            disabled={disabled}
        />
    );
};

export const SchemaVersionInput = ({ disabled, crdId }: InputProps) => {
    console.log('input');
    const { data, isLoading } = useGetOne('crd', { id: crdId });
    if (isLoading) return <Loading />;
    if (!data) return null;
    const storedVersion = data.spec.versions.filter(
        (version: any) => version.storage
    )[0];
    return (
        <TextInput
            source="version"
            defaultValue={storedVersion.name}
            disabled={disabled}
        />
    );
};

interface InputProps {
    sx?: SxProps<Theme>;
    disabled?: boolean;
    crdId?: string;
}
