import { SaveButton, Toolbar, DeleteWithConfirmButton, ToolbarClasses, useResourceContext, useDataProvider, useNotify, useStore, useRedirect } from "react-admin";
import { updateCrdIds } from "../utils";

export const DeleteConfirmToolbar = () => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const [crdIds, setCrdIds] = useStore<string[]>('crdIds', []);

    const onSuccess = (data: any) => {
        if (resource === 'crs') {
            updateCrdIds(dataProvider, setCrdIds);
        }
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    return (
        <Toolbar>
            <div className={ToolbarClasses.defaultToolbar}>
                <SaveButton />
                <DeleteWithConfirmButton mutationOptions={{ onSuccess }} />
            </div>
        </Toolbar>
    );
};