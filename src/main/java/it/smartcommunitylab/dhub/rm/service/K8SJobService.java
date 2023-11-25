package it.smartcommunitylab.dhub.rm.service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.api.model.batch.v1.Job;
import io.fabric8.kubernetes.client.KubernetesClient;

@Service
public class K8SJobService extends K8SResourceService<Job> {
    
    public K8SJobService(KubernetesClient client, AuthorizationService authService) {
        super(client, authService, 60);
    }

    public static final Logger logger = LoggerFactory.getLogger(K8SSvcService.class);

    @Override
    protected List<Job> getItems(String namespace) {
        return java.util.Arrays.asList(getAuthService().getJobSelector().split("\\|")).stream()
                    .map(s -> getKubernetesClient().batch().v1().jobs().inNamespace(namespace).withLabelSelector(s).list().getItems())
                    .flatMap(Collection::stream).collect(Collectors.toList());
    }

    

}
