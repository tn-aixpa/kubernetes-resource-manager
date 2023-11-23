package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.Collection;
import java.util.stream.Collectors;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareService;
import jakarta.validation.constraints.Pattern;

@Service
public class K8SServiceService {
    
    public static final Logger logger = LoggerFactory.getLogger(K8SServiceService.class);

    private final KubernetesClient client;
    private final AuthorizationService authService;

    
    public K8SServiceService(
        KubernetesClient client,
        AuthorizationService authService
    ) {
        Assert.notNull(client, "Client required");
        this.client = client;
        this.authService = authService;
    }

    public Page<IdAwareService> findAll(String namespace, Collection<String> ids, Pageable pageable) {
        List<IdAwareService> items = client.services().inNamespace(namespace).withLabelSelector(authService.getServiceSelector()).list().getItems().stream().map(IdAwareService::new).collect(Collectors.toList());

        if (ids != null && !ids.isEmpty()) {
            items = items.stream().filter(i -> ids.contains(i.getId())).collect(Collectors.toList());
        }

        //sort by ID and provide pagination
        items.sort((IdAwareService h1, IdAwareService h2) -> h1.getId().compareTo(h2.getId()));
        int offset = (int) pageable.getOffset();
        int pageSize = Math.min(pageable.getPageSize(), items.size());
        int toIndex = Math.min(offset + pageSize, items.size());

        return new PageImpl<>(items.subList(offset, toIndex), pageable, items.size());
    }

    public IdAwareService findById(String namespace, @Pattern(regexp = "[a-z0-9-]+") String serviceId) {
        io.fabric8.kubernetes.api.model.Service service = client.services().inNamespace(namespace).withLabelSelector(authService.getServiceSelector()).list().getItems().stream().filter(s -> s.getMetadata().getName().equals(serviceId)).findAny().orElse(null);
        if (service == null) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_SERVICE);
        }
        return new IdAwareService(service);

    }

}
