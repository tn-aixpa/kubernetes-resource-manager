import { Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button, useLogin, useTranslate } from 'react-admin';

export const SSOLogin = () => {
    const login = useLogin();
    const translate = useTranslate();

    return (
        <Root>
            <Card className={LoginClasses.card}>
                <Typography variant="h3" className="login-page-title">
                    {translate('login.title')}
                </Typography>
                <Button
                    label={translate('login.message')}
                    onClick={() => login({})}
                    sx={{ margin: 'auto', display: 'block' }}
                ></Button>
            </Card>
        </Root>
    );
};

const PREFIX = 'RaLogin';
export const LoginClasses = {
    card: `${PREFIX}-card`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',

    [`& .${LoginClasses.card}`]: {
        minWidth: 300,
        marginTop: '12em',
    },
}));
