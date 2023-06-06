import { TextInput, useChoicesContext } from 'react-admin';

export const PrecompiledInput = ({ props }: any) => {
    const { availableChoices } = useChoicesContext();

    let defaultVal;
    if (availableChoices && availableChoices.length > 0) {
        defaultVal = availableChoices[0].spec.names.kind;
    }
    if (!defaultVal) {
        return null;
    }

    return <TextInput source="kind" defaultValue={defaultVal} />;
};

// To use:
/*
<ReferenceInput source="kind" reference="crd" filter={{ id: useResourceContext() }} >
    <PrecompiledInput />
</ReferenceInput>
*/
