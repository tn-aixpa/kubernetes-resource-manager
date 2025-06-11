// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    CreateButton,
    DeleteWithConfirmButton,
    EditButton,
    ListButton,
    TopToolbar as ReactAdminTopToolbar,
    ShowButton,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { useUpdateCrdIds } from '../hooks/useUpdateCrdIds';
import { InspectButton } from '@dslab/ra-inspect-button';
import LogButton from './LogButton';

export const TopToolbar = (props: TopToolbarProps) => {
    const { hasCreate, hasEdit, hasShow, hasList, hasDelete, hasYaml, hasLog } = props;

    return (
        <ReactAdminTopToolbar>
            {hasYaml && <InspectButton key="yaml-button" language="yaml"/>}
            {hasLog && <LogButton/>}
            {hasCreate && <CreateButton key="create-button" />}
            {hasEdit && <EditButton key="edit-button" />}
            {hasShow && <ShowButton key="show-button" />}
            {hasList && <ListButton key="list-button" />}
            {hasDelete && <DeleteWithConfirmButton key="delete-button" />}
        </ReactAdminTopToolbar>
    );
};

export interface TopToolbarProps {
    hasShow?: boolean;
    hasList?: boolean;
    hasEdit?: boolean;
    hasCreate?: boolean;
    hasDelete?: boolean;
    hasYaml?: boolean;
    hasLog?: boolean;
}

export const CreateTopToolbar = (props: TopToolbarProps) => {
    const { hasList = true } = props;
    return <TopToolbar {...props} hasList={hasList} />;
};

export const EditTopToolbar = (props: TopToolbarProps) => {
    const { hasList = true, hasShow = true } = props;
    return <TopToolbar {...props} hasList={hasList} hasShow={hasShow} />;
};

export const ListTopToolbar = (props: TopToolbarProps) => {
    const { hasCreate = true } = props;
    return <TopToolbar {...props} hasCreate={hasCreate} />;
};

export const ShowTopToolbar = (props: TopToolbarProps) => {
    const { hasEdit = true, hasList = true, hasDelete = true, hasLog = false } = props;
    return (
        <TopToolbar
            {...props}
            hasEdit={hasEdit}
            hasList={hasList}
            hasDelete={hasDelete}
            hasLog={hasLog}
        />
    );
};

const SchemaDeleteButton = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();
    const notify = useNotify();
    const { updateCrdIds } = useUpdateCrdIds();

    const onSuccess = (data: any) => {
        updateCrdIds();
        notify('ra.notification.deleted', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />;
};

export const SchemaShowTopToolbar = (props: TopToolbarProps) => {
    const {
        hasCreate,
        hasEdit = true,
        hasShow,
        hasList = true,
        hasDelete = true,
    } = props;
    return (
        <ReactAdminTopToolbar>
            {hasCreate && <CreateButton key="create-button" />}
            {hasEdit && <EditButton key="edit-button" />}
            {hasShow && <ShowButton key="show-button" />}
            {hasList && <ListButton key="list-button" />}
            {hasDelete && <SchemaDeleteButton key="delete-button" />}
        </ReactAdminTopToolbar>
    );
};
