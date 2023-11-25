package it.smartcommunitylab.dhub.rm.service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.client.KubernetesClient;

/**
 * Service for K8S Deployment resource
 */
@Service
public class K8SDeploymentService extends K8SResourceService<Deployment> {
    
    public K8SDeploymentService(KubernetesClient client, AuthorizationService authService) {
        super(client, authService, 60);
    }

    public static final Logger logger = LoggerFactory.getLogger(K8SSvcService.class);

    @Override
    protected List<Deployment> getItems(String namespace) {
        return java.util.Arrays.asList(getAuthService().getDeploymentSelector().split("\\|")).stream()
                    .map(s -> getKubernetesClient().apps().deployments().inNamespace(namespace).withLabelSelector(s).list().getItems())
                    .flatMap(Collection::stream).collect(Collectors.toList());
    }

    

}
