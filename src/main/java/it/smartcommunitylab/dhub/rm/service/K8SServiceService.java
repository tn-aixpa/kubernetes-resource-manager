package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
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

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareService;
import jakarta.validation.constraints.Pattern;

@Service
public class K8SServiceService {
    
    public static final Logger logger = LoggerFactory.getLogger(K8SServiceService.class);

    private final KubernetesClient client;
    private final AuthorizationService authService;


    private ConcurrentHashMap<String, java.util.Map<String,IdAwareService>> serviceMap = new ConcurrentHashMap<>();
    // cache the whole list as a single entity
    private LoadingCache<String, java.util.Map<String, IdAwareService>> serviceCache = CacheBuilder.newBuilder()
        .expireAfterWrite(1, TimeUnit.MINUTES)
        .build(
            new CacheLoader<String, java.util.Map<String, IdAwareService>>() {
                @Override
                public java.util.Map<String, IdAwareService> load(String key) throws Exception {
                List<IdAwareService> items = java.util.Arrays.asList(authService.getServiceSelector().split("\\|")).stream()
                    .map(s -> client.services().inNamespace(key).withLabelSelector(s).list().getItems())
                    .flatMap(Collection::stream)
                    .map(IdAwareService::new)
                    .collect(Collectors.toList()); 

                    synchronized(serviceMap) {
                        serviceMap.put(key, new java.util.HashMap<>());
                        items.forEach(s -> {
                            serviceMap.get(key).put(s.getId(), s);
                        });
                    }
                    return serviceMap.get(key);
                }    
            }
        );
    
    public K8SServiceService(
        KubernetesClient client,
        AuthorizationService authService
    ) {
        Assert.notNull(client, "Client required");
        this.client = client;
        this.authService = authService;
    }


    private List<IdAwareService> readServices(String namespace) {
        try {
            return new java.util.LinkedList<>(serviceCache.get(namespace).values());
        } catch (ExecutionException e) {
            return java.util.Collections.emptyList();
        }
    }

        private IdAwareService readService(String name, String namespace) {
        try {
            return serviceCache.get(namespace).get(name);
        } catch (ExecutionException e) {
            return null;
        }
    }

    public Page<IdAwareService> findAll(String namespace, Collection<String> ids, Pageable pageable) {
        List<IdAwareService> items = readServices(namespace); 

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
        IdAwareService service = readService(serviceId, namespace);
        if (service == null) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_SERVICE);
        }
        return service;

    }

}
