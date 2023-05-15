import { DataProvider } from 'react-admin';

export const parse = (v: string) => {
    try {
        return JSON.parse(v);
    } catch (error) {
        return v;
    }
};

export const format = (v: any) => {
    return typeof v == 'string' ? v : JSON.stringify(v);
};

export function updateCrdIds(dataProvider: DataProvider, setCrdIds: Function) {
    dataProvider.fetchResources().then((res: any) => {
        console.log('updating CRD ids in store');
        setCrdIds(res);
    });
}
