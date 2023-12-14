import {
    useGetOne,
    Loading,
    useRecordContext,
    useResourceContext,
    Button,
    Identifier,
    RecordContextProvider,
} from 'react-admin';
import { Box, Dialog, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import { useState } from 'react';

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

const LogView = ({ toggleOpen }: { toggleOpen: Function }) => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const { data, isLoading } = useGetOne( resource, { id: record.id, meta: {log: true} }, {} );
    if (isLoading) return <Loading />;
    if (!data) return null;

    return (
        <RecordContextProvider value={record}>
            <Box height={'80vh'} sx={{
                margin: '24px',
                backgroundColor: '#000',
                color: '#fff',
                overflowX: 'scroll',
                overflowY: 'scroll',
            }}>{data?.records?.toReversed().map((line: string) => (
            <Box component={'div'} sx={{whiteSpace: 'nowrap', padding: '2px 0 2px 0'}}>{line}</Box>))
            }</Box>
        </RecordContextProvider>
    );
};

const LogModal = ({
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
            maxWidth="lg"
        >
            <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
            >
                {recordId}
            </BootstrapDialogTitle>
            <LogView toggleOpen={toggleOpen}></LogView>
        </Dialog>
    );
};

const LogButton = () => {
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
                label="LOG"
            />
            {open && (
                <LogModal
                    recordId={record.id}
                    open={open}
                    toggleOpen={setOpen}
                />
            )}
        </>
    );
};

export default LogButton;
