import {
    useGetOne,
    Loading,
    useRecordContext,
    useResourceContext,
    Button,
    Identifier,
    SimpleForm,
    EditContextProvider,
    useUpdate,
    useRefresh,
    useEditController,
    EditBase,
    useNotify,
} from 'react-admin';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import { useState } from 'react';
import { AceEditorInput } from '@smartcommunitylab/ra-ace-editor';
import { ViewToolbar } from './ViewToolbar';

interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const YamlEdit = ({ toggleOpen }: { toggleOpen: Function }) => {
    const notify = useNotify();
    const resource = useResourceContext();
    const record = useRecordContext();
    const editContext = useEditController();
    const [update] = useUpdate();
    const refresh = useRefresh();
    const { data, isLoading } = useGetOne(
        resource,
        { id: record.id, meta: { yaml: true } },
        {}
    );
    if (isLoading) return <Loading />;
    if (!data) return null;
    if (editContext.isLoading) return null;

    const id = record.id;
    editContext.record = data;

    const onSubmit = (data: any) => {
        return update(
            resource,
            { id, data: data.yaml, meta: { yaml: true } },
            {
                onSuccess: () => {
                    refresh();
                    toggleOpen(false);
                },
                onError: (error, variables) => {
                    console.log('Error:', error);
                    notify('resources.cr.serverError', { type: 'error' });
                },
            }
        );
    };

    return (
        <EditContextProvider value={editContext}>
            <EditBase transform={(data: any) => data.yaml}>
                <SimpleForm
                    record={data}
                    onSubmit={onSubmit}
                    toolbar={<ViewToolbar />}
                >
                    <AceEditorInput
                        mode="yaml"
                        source="yaml"
                        theme="monokai"
                        label={false}
                    />
                </SimpleForm>
            </EditBase>
        </EditContextProvider>
    );
};

const YamlModal = ({
    recordId,
    open,
    toggleOpen,
}: {
    recordId: Identifier;
    open: boolean;
    toggleOpen: Function;
}) => {
    const handleClose = () => {
        toggleOpen(false);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth
            maxWidth="md"
        >
            <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
            >
                {recordId}
            </BootstrapDialogTitle>
            <YamlEdit toggleOpen={toggleOpen}></YamlEdit>
        </Dialog>
    );
};

const YamlButton = () => {
    const record = useRecordContext();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Button
                onClick={handleClickOpen}
                startIcon={<CodeIcon />}
                label="YAML"
            />
            {open && (
                <YamlModal
                    recordId={record.id}
                    open={open}
                    toggleOpen={setOpen}
                />
            )}
        </>
    );
};

export default YamlButton;
