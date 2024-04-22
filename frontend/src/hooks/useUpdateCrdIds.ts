import { useCallback, useEffect } from 'react';
import { useAuthProvider, useDataProvider, useStore } from 'react-admin';

export const useUpdateCrdIds = () => {
    const dataProvider = useDataProvider();
    const authProvider = useAuthProvider();
    const [crdIds, setCrdIds] = useStore<string[]>('crdIds', []);

    const updateCrdIds = useCallback(() => {
        console.log('updateCrdIds called');
        if (authProvider) {
            authProvider.checkAuth({}).catch(() => {
                console.log('unauthorized, return');
                return;
            });
        }

        console.log('call dataProvider..');
        dataProvider
            .fetchResources()
            .then((res: string[]) => {
                if (Array.isArray(res)) {
                    setCrdIds(res);
                }
            })
            .catch((error: any) => {
                console.log('Error updating CRD IDs:', error);
            });
    }, [dataProvider, authProvider, setCrdIds]);

    useEffect(() => {
        if (authProvider) {
            authProvider.checkAuth({}).catch(() => {
                console.log('unauthorized, return');
                return;
            });
        }

        updateCrdIds();
    }, [dataProvider, authProvider, setCrdIds, updateCrdIds]);

    return { crdIds, updateCrdIds };
};

