import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    console.log('location', location.pathname);
    const path = location.pathname.slice(1).split('/');
    console.log('path', path);
    //const resource = path[0];
    let links = [
        {
            name: path[0],
            ref: `${window.location.origin}/${path[0]}`,
        },
    ];

    if (path.length === 2) {
        //create or edit
        if (path[1] === 'create') {
            links.push({
                name: 'create',
                ref: `${window.location.origin}/${path[0]}/create`,
            });
        } else {
            links.push({
                name: path[1],
                ref: `${window.location.origin}/${path[0]}/${path[1]}/show`,
            });
            links.push({
                name: 'edit',
                ref: `${window.location.origin}/${path[0]}/${path[1]}`,
            });
        }
    } else if (path.length === 3) {
        //show
        links.push({
            name: path[1],
            ref: `${window.location.origin}/${path[0]}/${path[1]}/show`,
        });
    }

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ paddingTop: '10px' }}>
            <Link underline="hover" color="inherit" href="/">
                Dashboard
            </Link>
            {links.map((page, index) =>
                index !== links.length - 1 ? (
                    <Link
                        key={page.name}
                        underline="hover"
                        color="inherit"
                        href={page.ref}
                    >
                        {page.name}
                    </Link>
                ) : (
                    <Typography color="text.primary">{page.name}</Typography>
                )
            )}
            {/* <Link underline="hover" color="inherit" href="/">
                MUI
            </Link>
            <Link
                underline="hover"
                color="inherit"
                href="/material-ui/getting-started/installation/"
            >
                Core
            </Link>
            <Typography color="text.primary">Breadcrumbs</Typography> */}
        </Breadcrumbs>
    );
};

export default Breadcrumb;
