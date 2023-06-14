import { Breadcrumbs, Typography } from '@mui/material';
import { useResourceContext, useTranslate } from 'react-admin';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
    const translate = useTranslate();
    const location = useLocation();
    const resource = useResourceContext();

    const regexShow = '^/[^/]*/([^/]*)/show(/.*)?$';
    const regexCreate = '^/[^/]*/create(/.*)?$';
    const regexEdit = '^/[^/]*/([^/]*)(/[^/]*)?$';

    let links = [];

    // Dashboard
    links.push({
        name: translate('ra.page.dashboard'),
        ref: '/',
    });

    if (resource) {
        // List
        links.push({
            name: translate(`resources.${resource}.name`, {
                smart_count: 2,
                _: resource,
            }),
            ref: `/${resource}`,
        });

        const matchShow = location.pathname.match(regexShow);
        if (matchShow && matchShow[1]) {
            // Show
            links.push({
                name: matchShow[1],
                ref: `/${resource}/${matchShow[1]}/show`,
            });
        } else if (location.pathname.match(regexCreate)) {
            // Create
            links.push({
                name: translate('ra.action.create'),
                ref: `/${resource}/create`,
            });
        } else {
            const matchEdit = location.pathname.match(regexEdit);
            if (matchEdit && matchEdit[1]) {
                // Edit
                links.push({
                    name: matchEdit[1],
                    ref: `/${resource}/${matchEdit[1]}/show`,
                });
                links.push({
                    name: translate('ra.action.edit'),
                    ref: `/${resource}/${matchEdit[1]}`,
                });
            }
        }
        // List does not need additional elements
    }

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ paddingTop: '10px' }}>
            {links.map((page, index) =>
                index !== links.length - 1 ? (
                    <Link
                        key={page.name}
                        to={page.ref}
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography
                            color="text.secondary"
                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                        >
                            {page.name}
                        </Typography>
                    </Link>
                ) : (
                    <Typography key={page.name} color="text.primary">
                        {page.name}
                    </Typography>
                )
            )}
        </Breadcrumbs>
    );
};

export default Breadcrumb;
