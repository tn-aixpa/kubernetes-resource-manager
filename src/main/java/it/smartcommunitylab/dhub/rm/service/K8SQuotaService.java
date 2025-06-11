// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import io.fabric8.kubernetes.api.model.ResourceQuota;
import io.fabric8.kubernetes.client.KubernetesClient;

/**
 * Service for K8S Resource Quota resource
 */
@Service
public class K8SQuotaService extends K8SResourceService<ResourceQuota> {

    public static final Logger logger = LoggerFactory.getLogger(K8SPVCService.class);

    public K8SQuotaService(KubernetesClient client, K8SAuthorizationService authService) {
        super(client, authService, 60);
    }

    @Override
    protected List<ResourceQuota> getItems(String namespace) {
            return java.util.Arrays.asList(getAuthService().getQuotaSelector().split("\\|")).stream()
                        .map(s -> getKubernetesClient().resourceQuotas().inNamespace(namespace).withLabelSelector(s).list().getItems())
                        .flatMap(Collection::stream).collect(Collectors.toList());
    }
}
