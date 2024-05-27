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
import org.springframework.util.Assert;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import jakarta.validation.constraints.Pattern;

/**
 * Base class for service facade for the K8S resources.
 * Defines resource cache grouping resources to namespaces.
 */
public abstract class K8SResourceService<T extends HasMetadata> {
    
    public static final Logger logger = LoggerFactory.getLogger(K8SResourceService.class);

    private final KubernetesClient client;
    private final AuthorizationService authService;

    private ConcurrentHashMap<String, java.util.Map<String,IdAwareResource<T>>> resourceMap = new ConcurrentHashMap<>();
    private LoadingCache<String, java.util.Map<String, IdAwareResource<T>>> resourceCache;

    public K8SResourceService(
        KubernetesClient client,
        AuthorizationService authService,
        int cacheExpirationSec
    ) {
        Assert.notNull(client, "Client required");
        this.client = client;
        this.authService = authService;

        // loading cache to group resources for the namespace
        resourceCache = CacheBuilder.newBuilder()
        .expireAfterWrite(cacheExpirationSec, TimeUnit.SECONDS)
        .build(
            new CacheLoader<String, java.util.Map<String, IdAwareResource<T>>>() {
                @Override
                public java.util.Map<String, IdAwareResource<T>> load(String key) throws Exception {
                List<IdAwareResource<T>> items = getItems(key).stream()
                    .map(IdAwareResource::new)
                    .collect(Collectors.toList()); 

                    synchronized(resourceMap) {
                        resourceMap.put(key, new java.util.HashMap<>());
                        items.forEach(s -> {
                            resourceMap.get(key).put(s.getId(), s);
                        });
                    }
                    return resourceMap.get(key);
                }    
            }
        );
    }

    /**
     * Retrieve from K8S API the list of K8S resource corresponding to the namespace.
     * @param namespace
     * @return
     */
    protected abstract List<T> getItems(String namespace);

    /**
     * Reference to auth service
     * @return
     */
    protected AuthorizationService getAuthService() {
        return authService;
    }

    /**
     * Reference to K8S Client
     * @return
     */
    protected KubernetesClient getKubernetesClient() {
        return client;
    }
    
    /**
     * Get all namespace resources
     * @param namespace
     * @return
     */
    protected List<IdAwareResource<T>> readResources(String namespace) {
        try {
            return new java.util.LinkedList<>(resourceCache.get(namespace).values());
        } catch (ExecutionException e) {
            return java.util.Collections.emptyList();
        }
    }

    /**
     * Get a single resource by name
     * @param name
     * @param namespace
     * @return
     */
    protected IdAwareResource<T> readResource(String name, String namespace) {
        try {
            return resourceCache.get(namespace).get(name);
        } catch (ExecutionException e) {
            return null;
        }
    }

    /**
     * Access return cache
     * @return
     */
    protected LoadingCache<String, java.util.Map<String, IdAwareResource<T>>> getResourceCache() {
        return resourceCache;
    }

    /**
     * Find all namespace resources paginated and optionally filtered by list of IDs.
     * @param namespace
     * @param ids
     * @param pageable
     * @return
     */
    public Page< IdAwareResource<T>> findAll(String namespace, Collection<String> ids, Pageable pageable) {
        List< IdAwareResource<T>> items = readResources(namespace); 

        if (ids != null && !ids.isEmpty()) {
            items = items.stream().filter(i -> ids.contains(i.getId())).collect(Collectors.toList());
        }

        //sort by ID and provide pagination
        items.sort(( IdAwareResource<T> h1,  IdAwareResource<T> h2) -> h1.getId().compareTo(h2.getId()));
        int offset = (int) pageable.getOffset();
        int pageSize = Math.min(pageable.getPageSize(), items.size());
        int toIndex = Math.min(offset + pageSize, items.size());

        return new PageImpl<>(items.subList(offset, toIndex), pageable, items.size());
    }

    /**
     * Find a single resource provided namespace and resource Id
     * @param namespace
     * @param resourceId
     * @return
     */
    public  IdAwareResource<T> findById(String namespace, @Pattern(regexp = SystemKeys.REGEX_CR_ID) String resourceId) {
         IdAwareResource<T> resource = readResource(resourceId, namespace);
        if (resource == null) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_RESOURCE);
        }
        return resource;

    }

}
