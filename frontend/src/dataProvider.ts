//import { Buffer } from 'buffer';
import { UserManager } from 'oidc-client-ts';
import { stringify } from 'querystring';
import { fetchUtils, DataProvider } from 'ra-core';
import jsonServerProvider from 'ra-data-json-server';
import { Options } from 'react-admin';

const dataProvider = (
    baseUrl: string,
    userManager: UserManager
): DataProvider => {
    const httpClient = async (url: string, options: Options = {}) => {
        if (!options.headers) {
            options.headers = new Headers({ Accept: 'application/json' });
        }
    
        const user = await userManager.getUser();
    
        if (user) {
            options.user = {
                authenticated: true,
                token: 'Bearer ' + user.access_token,
            };
    
            return fetchUtils.fetchJson(url, options);
        }
        return Promise.reject('No user found in store');
    };


    const apiUrl = baseUrl + '/api';
    const provider = jsonServerProvider(apiUrl, httpClient);

    return {
        fetchResources: async (): Promise<string[]> => {
            const user = await userManager.getUser();
            if (!user) {
                return [];
            }
            return httpClient(`${apiUrl}/crs?size=1000`).then(
                ({ headers, json }) => {
                    if (!json.content) {
                        throw new Error('the response must match page<> model');
                    }
                    const crdIds: string[] = json.content.map(
                        (crs: any) => crs.crdId
                    );
                    return Array.from(new Set(crdIds)).sort(
                        (a: string, b: string) => a.localeCompare(b)
                    );
                }
            );
        },
        getList: (resource, params) => {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                sort: field + ',' + order,
                page: page - 1,
                size: perPage,
            };
            let url = `${apiUrl}/${resource}?${stringify(query)}`;
            const idFilter = params?.filter?.id;
            if (idFilter) {
                url += `&id=${idFilter}`;
            }

            return httpClient(url).then(({ headers, json }) => {
                if (!json.content) {
                    throw new Error('the response must match page<> model');
                }
                return {
                    data: json.content,
                    total: parseInt(json.totalElements, 10),
                };
            });
        },
        getOne: (resource, params) => provider.getOne(resource, params),
        getMany: (resource, params) => {
            let url = `${apiUrl}/${resource}`;
            const ids = params.ids;
            if (ids && ids.length > 0) {
                url += `?id=${ids.join(',')}`;
            }

            return httpClient(url).then(({ headers, json }) => {
                if (!json.content) {
                    throw new Error('the response must match page<> model');
                }
                return {
                    data: json.content,
                    total: parseInt(json.totalElements, 10),
                };
            });
        },
        getManyReference: (resource, params) => {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                sort: field + ',' + order,
                page: page - 1,
                size: perPage,
            };

            let url = `${apiUrl}`;
            if (resource === 'crs') {
                url += `/crd/${params.id}/schemas`;
            } else {
                url += `/${resource}`;
            }

            url += `?${stringify(query)}`;

            return httpClient(url).then(({ headers, json }) => {
                if (!json.content) {
                    throw new Error('the response must match page<> model');
                }
                return {
                    data: json.content,
                    total: parseInt(json.totalElements, 10),
                };
            });
        },
        update: (resource, params) => provider.update(resource, params),
        updateMany: (resource, params) => provider.updateMany(resource, params),
        create: (resource, params) => provider.create(resource, params),
        delete: (resource, params) => provider.delete(resource, params),
        deleteMany: (resource, params) =>
            Promise.all(
                params.ids.map(id =>
                    httpClient(`${apiUrl}/${resource}/${id}`, {
                        method: 'DELETE',
                    })
                )
            ).then(responses => ({ data: responses.map(({ json }) => json) })),
    };
};

export default dataProvider;
