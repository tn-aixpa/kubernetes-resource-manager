
import { useCallback, useEffect } from "react";
import { useDataProvider, useStore } from "react-admin"



export const useUpdateCrdIds = () => {
    const dataProvider = useDataProvider();
    const [crdIds, setCrdIds] = useStore<string[]>('crdIds', []);

    const updateCrdIds = useCallback(() => {
        dataProvider
        .fetchResources()
        .then((res: any) => {
            console.log('updating CRD ids in store');
            setCrdIds(res);
        })
        .catch((error: any) => {
            console.log('updateCrdIds', error);
        });
    }, [dataProvider, setCrdIds])

    useEffect(() => {
        updateCrdIds();
    }, [dataProvider, setCrdIds, updateCrdIds]);

    return {crdIds, updateCrdIds};
}