// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.client.KubernetesClient;

/**
 * Service for K8S Deployment resource
 */
@Service
public class K8SDeploymentService extends K8SResourceService<Deployment> {
    
    public K8SDeploymentService(KubernetesClient client, K8SAuthorizationService authService) {
        super(client, authService, 60);
    }

    public static final Logger logger = LoggerFactory.getLogger(K8SSvcService.class);

    @Override
    protected List<Deployment> getItems(String namespace) {
        return java.util.Arrays.asList(getAuthService().getDeploymentSelector().split("\\|")).stream()
                    .map(s -> getKubernetesClient().apps().deployments().inNamespace(namespace).withLabelSelector(s).list().getItems())
                    .flatMap(Collection::stream).collect(Collectors.toList());
    }

    /**
     * Get job log
     * @param namespace
     * @param jobId
     * @return
     */
    public List<String> getLog(String namespace, String jobId) {
        String log = getKubernetesClient().apps().deployments().inNamespace(namespace).withName(jobId).getLog();
        if (StringUtils.hasText(log)) {
            return Arrays.asList(log.split("\n"));
        }
        return Collections.emptyList();
    }
    

}
