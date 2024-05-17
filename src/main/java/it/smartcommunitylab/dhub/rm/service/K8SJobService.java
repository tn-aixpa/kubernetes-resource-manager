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

import io.fabric8.kubernetes.api.model.batch.v1.Job;
import io.fabric8.kubernetes.client.KubernetesClient;
/**
 * Service for K8S Job resource
 */
@Service
public class K8SJobService extends K8SResourceService<Job> {
    
    public K8SJobService(KubernetesClient client, K8SAuthorizationService authService) {
        super(client, authService, 60);
    }

    public static final Logger logger = LoggerFactory.getLogger(K8SSvcService.class);

    @Override
    protected List<Job> getItems(String namespace) {
        return java.util.Arrays.asList(getAuthService().getJobSelector().split("\\|")).stream()
                    .map(s -> getKubernetesClient().batch().v1().jobs().inNamespace(namespace).withLabelSelector(s).list().getItems())
                    .flatMap(Collection::stream).collect(Collectors.toList());
    }

    /**
     * Kill the specified job
     * @param namespace
     * @param jobId
     */
    public void delete(String namespace, String jobId) {
        getResourceCache().invalidate(namespace);
        getKubernetesClient().batch().v1().jobs().inNamespace(namespace).withName(jobId).delete();
    }

    /**
     * Get job log
     * @param namespace
     * @param jobId
     * @return
     */
    public List<String> getLog(String namespace, String jobId) {
        String log = getKubernetesClient().batch().v1().jobs().inNamespace(namespace).withName(jobId).getLog();
        if (StringUtils.hasText(log)) {
            return Arrays.asList(log.split("\n"));
        }
        return Collections.emptyList();
    }

}
