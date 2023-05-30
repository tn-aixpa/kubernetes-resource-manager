import { ComponentType, ReactElement } from 'react';

export interface View {
    key: string;
    name?: string;
    list?: ComponentType<any> | ReactElement;
    create?: ComponentType<any> | ReactElement;
    edit?: ComponentType<any> | ReactElement;
    show?: ComponentType<any> | ReactElement;
    icon?: ComponentType<any>;
}

export class Views {
    views: Array<View> = [];

    put(v: View) {
        this.views.push(v);
    }

    get(key: string) {
        return this.views.find(v => v.key === key);
    }

    set(views: View[]) {
        this.views = views;
    }

    list() {
        return this.views;
    }
}
