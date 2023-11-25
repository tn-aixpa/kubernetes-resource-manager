package it.smartcommunitylab.dhub.rm.service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.client.KubernetesClient;

/**
 * Service for K8S Svc resource
 */
@Service
public class K8SSvcService extends K8SResourceService<io.fabric8.kubernetes.api.model.Service> {
    
    public K8SSvcService(KubernetesClient client, AuthorizationService authService) {
        super(client, authService, 60);
    }

    public static final Logger logger = LoggerFactory.getLogger(K8SSvcService.class);

    @Override
    protected List<io.fabric8.kubernetes.api.model.Service> getItems(String namespace) {
            return java.util.Arrays.asList(getAuthService().getServiceSelector().split("\\|")).stream()
                        .map(s -> getKubernetesClient().services().inNamespace(namespace).withLabelSelector(s).list().getItems())
                        .flatMap(Collection::stream).collect(Collectors.toList());

    }

    

}
