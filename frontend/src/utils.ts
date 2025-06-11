// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Config } from './providers/configProvider';

export const parseArray = (v: string) => {
    try {
        return v.split(",");
    } catch (error) {
        return v;
    }
};

export const formatArray = (v: any) => {
    return !v || typeof v == 'string' ? v : v.join(",");
};

/*
const parseJson = (v: string) => {
    try {
        return JSON.parse(v);
    } catch (error) {
        return v;
    }
};

const formatJson = (v: any) => {
    return typeof v == 'string' ? v : JSON.stringify(v);
};
*/



export const labels2types = (labels?: any) => {

    if (!labels) return [];

    const corePrefix = Config.application.coreName;

    if (labels['com.coder.resource']) return [{name: labels['app.kubernetes.io/name']}];
    if (labels['nuclio.io/class']) return [{name: 'nuclio'}];
    if (labels[corePrefix + '/runtime']) {
        const res: any[] = [/*{name: 'core'}*/];
        Object.keys(labels).forEach(l => {
            if (l === corePrefix + '/runtime') res.push({name: 'runtime:' + labels[l]});
            if (l === corePrefix + '/project') res.push({name: 'project:' + labels[l]});
            if (l === corePrefix + '/function') res.push({name: 'function:' + labels[l]});
        });
        return res;
    }
    if (labels['app.kubernetes.io/name'] === 'DremioRestServer') return [{name: 'DremioRestServer'}];
    if (labels['app.kubernetes.io/name'] === 'Postgrest') return [{name: 'PostgREST'}];
    // return '';
}