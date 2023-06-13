import {
    useGetOne,
    Loading,
    useRecordContext,
    useResourceContext,
    Button,
    Identifier,
} from 'react-admin';
import { styled, Dialog, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import { useState } from 'react';
import { AceEditorField } from '@smartcommunitylab/ra-ace-editor';

interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

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

const YamlModal = ({
    recordId,
    resource,
    open,
    toggleOpen,
}: {
    recordId: Identifier;
    resource: string;
    open: boolean;
    toggleOpen: Function;
}) => {
    const { data, isLoading } = useGetOne(
        resource,
        { id: recordId, meta: { yaml: true } },
        {}
    );
    if (isLoading) return <Loading />;
    if (!data) return null;

    const handleClose = () => {
        toggleOpen(false);
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
            >
                {recordId}
            </BootstrapDialogTitle>
            <AceEditorField
                mode="yaml"
                record={{
                    body: data.yaml,
                }}
                source="body"
                theme="github"
            />
        </BootstrapDialog>
    );
};

const YamlButton = () => {
    const record = useRecordContext();
    const resource = useResourceContext();
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
            {open && <YamlModal
                recordId={record.id}
                resource={resource}
                open={open}
                toggleOpen={setOpen}
            />}
        </>
    );
};

export default YamlButton;
