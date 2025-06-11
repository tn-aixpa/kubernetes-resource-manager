// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useGetOne, useResourceContext } from 'react-admin';

export const useCrTransform = () => {
    const crdId = useResourceContext();
    const [apiVersion, setApiVersion] = useState<string>('');
    const [kind, setKind] = useState<string>('');
    const { data } = useGetOne('crd', { id: crdId });

    useEffect(() => {
        if (data && data.spec) {
            const group = data.spec.group;
            const storedVersion = data.spec.versions.filter(
                (version: any) => version.storage
            )[0];
            setApiVersion(`${group}/${storedVersion.name}`);
            setKind(data.spec.names.kind);
        }
    }, [data]);

    return { apiVersion, kind };
};
