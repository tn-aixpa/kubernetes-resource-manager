// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import {
    Button,
    EmptyClasses,
    ResourceDefinition,
    useGetList,
    usePermissions,
    useResourceDefinitions,
    useTranslate,
} from 'react-admin';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const NumberOfResources = ({ resource }: { resource: string }) => {
    const [numberOfResources, setNumberOfResources] = useState(0);
    const { total } = useGetList(resource, {
        pagination: { page: 1, perPage: 1 },
        sort: { field: 'id', order: 'ASC' },
        filter: null,
    });

    useEffect(() => {
        if (total) {
            setNumberOfResources(total);
        }
    }, [total]);

    return (
        <Grid item xs={12}>
            <Typography variant="h4">{numberOfResources}</Typography>
        </Grid>
    );
};

const Empty = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    return (
        <div className={EmptyClasses.message} style={{ textAlign: 'center' }}>
            <Typography variant="h4" paragraph>
                {translate('dashboard.emptyTitle')}
            </Typography>
            <Typography variant="body1" sx={{ paddingBottom: '20px' }}>
                {translate('dashboard.emptySubtitle')}
            </Typography>
            <Button
                label={translate('resources.crs.name', { smart_count: 2 })}
                variant="contained"
                onClick={() => navigate('/crs')}
            />
        </div>
    );
};

const AppDashboard = () => {
    const translate = useTranslate();
    const resources = useResourceDefinitions();
    const navigate = useNavigate();
    const { permissions } = usePermissions();
    const hasListPermission = (resource: string) => permissions && permissions.canAccess(resource, 'list')

    const cards: any[] = [];
    
    Object.values(resources).forEach((resource: ResourceDefinition) => {
        if (
            resource.name !== 'crd' &&
            resource.name !== 'crs' &&
            !resource.name.startsWith('k8s_') &&
            resource.hasList &&
            hasListPermission(resource.name)
        ) {
            cards.push(
                <Card key={resource.name}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={1}>
                                {resource.icon ? (
                                    <resource.icon />
                                ) : (
                                    <ViewListIcon />
                                )}
                            </Grid>
                            <Grid item xs={11}>
                                {resource.options ? resource.options.label : ''}
                            </Grid>
                            <NumberOfResources resource={resource.name} />
                            <Grid item xs={12}>
                                <Button
                                    key={resource.name}
                                    to={resource.name}
                                    label="dashboard.goToResource"
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={() =>
                                        navigate('/' + resource.name)
                                    }
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            );
        }
    });

    return (
        <>
            <CardHeader title={translate('dashboard.title')} />
            {cards.length > 0 ? (
                <Grid container spacing={2}>
                    {cards.map(card => (
                        <Grid item xs={12} md={3} key={card.key}>
                            {card}
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Empty />
            )}
        </>
    );
};

export default AppDashboard;
