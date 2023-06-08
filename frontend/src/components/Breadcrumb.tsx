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

    if (resource) {
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
            <Link to="/" className="breadcrumb-link">
                {translate('ra.page.dashboard')}
            </Link>
            {links.map((page, index) =>
                index !== links.length - 1 ? (
                    <Link
                        key={page.name}
                        to={page.ref}
                        className="breadcrumb-link"
                    >
                        {page.name}
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
