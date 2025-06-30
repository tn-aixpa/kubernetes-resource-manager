import { AppBar, TitlePortal } from 'react-admin';
import { IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

import { Config } from './providers/configProvider';

const SettingsButton = () => (
    <IconButton color="inherit" href={Config.application.source} target="_blank" rel="noopener noreferrer">
        <GitHubIcon />
    </IconButton>
);

const CustomAppBar = () => <AppBar>
        <TitlePortal />
        <SettingsButton />
    </AppBar>;

export default CustomAppBar;