import { useCallback, useEffect } from 'react';
import { useDataProvider, useStore } from 'react-admin';

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
            console.log('Error updating CRD IDs:', error);
        });
    }, [dataProvider, setCrdIds])

    useEffect(() => {
        updateCrdIds();
    }, [dataProvider, setCrdIds, updateCrdIds]);

    return {crdIds, updateCrdIds};
}

/*
import { createContext, useCallback, useContext, useEffect } from 'react';
import { useDataProvider, useStore } from 'react-admin';
import { View, Views } from '../resources';
import { CrCreate, CrEdit, CrList, CrShow } from '../resources/cr';
import crPostgres from '../resources/cr.postgres.db.movetokube.com';
import crPostgresUsers from '../resources/cr.postgresusers.db.movetokube.com';

const customViews: { [index: string]: View } = {
    'postgres.db.movetokube.com': crPostgres,
    'postgresusers.db.movetokube.com': crPostgresUsers,
};

export const ViewsContext = createContext(new Views());

const updateViews = (res: string[]) => {
    const viewsList: View[] = res.map(crdId => {
        if (customViews[crdId]) {
            let customView = customViews[crdId];
            if (!customView.list) {
                customView.list = CrList;
            }
            if (!customView.create) {
                customView.create = CrCreate;
            }
            if (!customView.edit) {
                customView.edit = CrEdit;
            }
            if (!customView.show) {
                customView.show = CrShow;
            }
            return customView;
        }
        const defaultView = {
            key: crdId,
            name: crdId,
            list: CrList,
            create: CrCreate,
            edit: CrEdit,
            show: CrShow,
        };
        return defaultView;
    });
    return viewsList;
};

export const useUpdateCrdIds = () => {
    const dataProvider = useDataProvider();
    const [crdIds, setCrdIds] = useStore<string[]>('crdIds', []);
    const views = useContext(ViewsContext);

    const getViewsList = () => {
        return views.list();
    };

    const updateCrdIds = useCallback(() => {
        dataProvider
            .fetchResources()
            .then((res: any) => {
                setCrdIds(res);
                views.set(updateViews(res));
            })
            .catch((error: any) => {
                console.log('updateCrdIds', error);
            });
    }, [dataProvider, setCrdIds, views]);

    useEffect(() => {
        if (crdIds && crdIds.length === 0) {
            updateCrdIds();
        } else if (crdIds.length > 0 && views && views.list().length === 0) {
            views.set(updateViews(crdIds));
        }
    }, [crdIds, dataProvider, setCrdIds, updateCrdIds, views]);
    return { updateCrdIds, getViewsList };
};
*/
