package it.smartcommunitylab.dhub.rm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersionDetector;
import com.networknt.schema.ValidationMessage;
import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.GenericKubernetesResourceList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.NamespaceableResource;
import io.fabric8.kubernetes.client.dsl.base.CustomResourceDefinitionContext;
import io.fabric8.kubernetes.model.Scope;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.exception.ValidationException;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class CustomResourceService {

    Logger logger = LoggerFactory.getLogger(CustomResourceService.class);

    private final KubernetesClient client;
    private final CustomResourceDefinitionService crdService;
    private final CustomResourceSchemaService schemaService;
    private final AuthorizationService authService;

    public CustomResourceService(
        KubernetesClient client,
        CustomResourceDefinitionService crdService,
        CustomResourceSchemaService schemaService,
        AuthorizationService authService
    ) {
        Assert.notNull(client, "Client required");
        this.client = client;
        this.crdService = crdService;
        this.schemaService = schemaService;
        this.authService = authService;
    }

    private CustomResourceSchema checkSchema(String crdId, String version) {
        Optional<CustomResourceSchema> schema = schemaService.fetchByCrdIdAndVersion(crdId, version);

        if (!schema.isPresent()) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_SCHEMA_WITH_VERSION);
        }
        return schema.get();
    }

    /**
     * Create CRD context based on CRD ID and a version. Note that version parameter does not act as a filter,
     * because method withVersion() does not seem to filter for the given version (it might be a bug in the client code).
     * @param crdId
     * @param version if not provided, v1 is used by default but if it does not exist an error is thrown
     * @return CustomResourceDefinitionContext
     */
    private CustomResourceDefinitionContext createCrdContext(String crdId, String version) {
        String[] crdMeta = crdId.split("\\.", 2);
        String plural = crdMeta[0];
        String group = crdMeta[1];

        return new CustomResourceDefinitionContext.Builder()
            .withScope(Scope.NAMESPACED.value())
            .withGroup(group)
            .withName(crdId)
            .withPlural(plural)
            .withVersion(version)
            .build();
    }

    private NamespaceableResource<GenericKubernetesResource> fetchCustomResource(
        CustomResourceDefinitionContext context,
        String id,
        String namespace
    ) {
        GenericKubernetesResourceList customResourceObjectList = client
            .genericKubernetesResources(context)
            .inNamespace(namespace)
            .list();
        for (GenericKubernetesResource cr : customResourceObjectList.getItems()) {
            if (cr.getMetadata().getName().equals(id)) {
                return client.resource(cr);
            }
        }
        return null;
    }

    private Set<ValidationMessage> validateCR(CustomResourceSchema schema, GenericKubernetesResource cr) {
        //1. get CR spec as JsonNode
        JsonNode crAdditionalProps = cr.getAdditionalPropertiesNode();

        //2. get schema as JsonSchema
        ObjectMapper mapper = new ObjectMapper();
        JsonNode schemaNode = mapper.valueToTree(schema.getSchema());
        JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersionDetector.detect(schemaNode));
        JsonSchema jsonSchema = factory.getSchema(schemaNode);
        return jsonSchema.validate(crAdditionalProps);
    }

    public Page<IdAwareCustomResource> findAll(String crdId, String namespace, Collection<String> ids, Pageable pageable) {
        if (!authService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException(SystemKeys.ERROR_CRD_NOT_ALLOWED);
        }

        String version = crdService.fetchStoredVersionName(crdId);
        checkSchema(crdId, version);

        CustomResourceDefinitionContext context = createCrdContext(crdId, version);

        List<IdAwareCustomResource> crs;
        if (ids == null) {
            GenericKubernetesResourceList list = client.genericKubernetesResources(context).inNamespace(namespace).list();
            crs = list
                .getItems()
                .stream()
                .map(IdAwareCustomResource::new)
                .collect(Collectors.toList());
        } else {
            crs = new ArrayList<>();
            ids
                .stream()
                .forEach(id -> {
                    NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
                    if (cr != null) {
                        crs.add(new IdAwareCustomResource(cr.get()));
                    }
                });
        }

        //sort by ID and provide pagination
        crs.sort((IdAwareCustomResource h1, IdAwareCustomResource h2) -> h1.getId().compareTo(h2.getId()));
        int offset = (int) pageable.getOffset();
        int pageSize = Math.min(pageable.getPageSize(), crs.size());
        int toIndex = Math.min(offset + pageSize, crs.size());

        return new PageImpl<>(crs.subList(offset, toIndex), pageable, crs.size());
    }

    public IdAwareCustomResource findById(String crdId, String id, String namespace) {
        if (!authService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException(SystemKeys.ERROR_CRD_NOT_ALLOWED);
        }

        String storedVersion = crdService.fetchStoredVersionName(crdId);
        checkSchema(crdId, storedVersion);

        CustomResourceDefinitionContext context = createCrdContext(crdId, storedVersion);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
        if (cr == null) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_CR);
        }

        return new IdAwareCustomResource(cr.get());
    }

    public IdAwareCustomResource add(String crdId, IdAwareCustomResource request, String namespace) {
        if (!authService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException(SystemKeys.ERROR_CRD_NOT_ALLOWED);
        }

        //if schema is not found in the DB, an error is thrown
        String version = request.getCr().getApiVersion().split("/")[1];
        String storedVersion = crdService.fetchStoredVersionName(crdId);
        if (!version.equals(storedVersion)) {
            throw new IllegalArgumentException(String.format("Version %s is not stored", version));
        }
        CustomResourceSchema schema = checkSchema(crdId, version);

        //schema validation
        Set<ValidationMessage> errors = validateCR(schema, request.getCr());

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        return new IdAwareCustomResource(client.resource(request.getCr()).inNamespace(namespace).create());
    }

    public IdAwareCustomResource update(String crdId, String id, IdAwareCustomResource request, String namespace) {
        if (!authService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException(SystemKeys.ERROR_CRD_NOT_ALLOWED);
        }

        //if schema is not found in the DB, an error is thrown
        String version = request.getCr().getApiVersion().split("/")[1];
        String storedVersion = crdService.fetchStoredVersionName(crdId);
        if (!version.equals(storedVersion)) {
            throw new IllegalArgumentException(String.format("Version %s is not stored", version));
        }
        CustomResourceSchema schema = checkSchema(crdId, version);

        CustomResourceDefinitionContext context = createCrdContext(crdId, storedVersion);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
        if (cr == null) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_CR_WITH_VERSION);
        }

        //schema validation
        Set<ValidationMessage> errors = validateCR(schema, request.getCr());
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }

        return new IdAwareCustomResource(
            client
                .resource(cr.get())
                .edit(object -> {
                    object.setAdditionalProperties(request.getCr().getAdditionalProperties());
                    return object;
                })
        );
    }

    public void delete(String crdId, String id, String namespace) {
        if (!authService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException(SystemKeys.ERROR_CRD_NOT_ALLOWED);
        }

        String storedVersion = crdService.fetchStoredVersionName(crdId);
        checkSchema(crdId, storedVersion);

        CustomResourceDefinitionContext context = createCrdContext(crdId, storedVersion);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);

        //if version is not found, these CRD and version do not exist in Kubernetes and an error is thrown
        if (cr != null) {
            cr.delete();
        }
    }
}
