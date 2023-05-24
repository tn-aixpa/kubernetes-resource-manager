import { createContext, useCallback, useContext, useEffect } from 'react';
import { useDataProvider, useStore } from 'react-admin';
import { View, Views } from '../resources';
import { CrCreate, CrEdit, CrList, CrShow } from '../resources/cr';
import crCronTabsView from '../resources/cr.crontabs.stable.example.com';
import crAlertManagersView from '../resources/cr.alertmanagers.monitoring.coreos.com';

const customViews: { [index: string]: View } = {
    'crontabs.stable.example.com': crCronTabsView,
    'alertmanagers.monitoring.coreos.com': crAlertManagersView,
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
}

// TODO hook to obtain list of views
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
        } else if (crdIds.length > 0 && views && views.list().length === 0 ) {
            views.set(updateViews(crdIds));
        }
    }, [crdIds, dataProvider, setCrdIds, updateCrdIds, views]);
    return { updateCrdIds, getViewsList };
};
