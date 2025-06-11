// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import {
    Avatar,
    Button,
    Card,
    CardActions,
    CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import {
    Form,
    required,
    TextInput,
    useTranslate,
    useLogin,
    useNotify,
} from 'react-admin';

import Box from '@mui/material/Box';
import { AUTH_TYPE_BASIC } from '../providers/authProvider';

const AUTH_TYPE =
    (globalThis as any).REACT_APP_AUTH ||
    (process.env.REACT_APP_AUTH as string);

const Login = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(auth, location.state ? location.state.nextPathname : '/').catch(
            (error: Error) => {
                setLoading(false);
                let message = 'ra.auth.sign_in_error';
                let messageArg;
                if (typeof error === 'string') {
                    message = error;
                    messageArg = error;
                } else if (error && 'message' in error) {
                    message = error.message;
                    messageArg = error.message;
                }

                notify(message, {
                    type: 'error',
                    messageArgs: {
                        _: messageArg,
                    },
                });
            }
        );
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <Card sx={{ minWidth: 300, marginTop: '6em' }}>
                    <Box
                        sx={{
                            margin: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <LockIcon />
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            marginTop: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            color: theme => theme.palette.grey[500],
                        }}
                    >
                        {translate('login.basicMessage')}
                    </Box>
                    {AUTH_TYPE === AUTH_TYPE_BASIC && (
                        <Box sx={{ padding: '0 1em 0em 1em' }}>
                            <Box sx={{ marginTop: '1em' }}>
                                <TextInput
                                    autoFocus
                                    source="username"
                                    label={'ra.auth.username'}
                                    disabled={loading}
                                    validate={required()}
                                    fullWidth
                                />
                            </Box>
                            <Box sx={{ marginTop: '1em' }}>
                                <TextInput
                                    source="password"
                                    label={'ra.auth.password'}
                                    type="password"
                                    disabled={loading}
                                    validate={required()}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    )}

                    <CardActions sx={{ padding: '1em 1em 1em 1em' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading && (
                                <CircularProgress size={25} thickness={2} />
                            )}
                            {translate('ra.auth.sign_in')}
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Form>
    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

export default Login;

interface FormValues {
    username?: string;
    password?: string;
}
