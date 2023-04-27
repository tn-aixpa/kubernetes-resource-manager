package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

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
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;

@Service
public class CustomResourceService {
    private final KubernetesClient client;
    private final CustomResourceDefinitionService crdService;
    private final CustomResourceSchemaService schemaService;

    public CustomResourceService(KubernetesClient client, CustomResourceDefinitionService crdService, CustomResourceSchemaService schemaService) {
        Assert.notNull(client, "Client required");
        this.client = client;
        this.crdService = crdService;
        this.schemaService = schemaService;
    }

    private CustomResourceSchema checkSchema(String crdId, String version) {
        Optional<CustomResourceSchema> schema = schemaService.fetchByCrdIdAndVersion(crdId, version);

        if (!schema.isPresent()) {
            throw new NoSuchElementException("No schema found for this CRD and version");
        }
        return schema.get();
    }

    private CustomResourceDefinitionContext createCrdContext(String crdId, String version) {
        String[] crdMeta = crdId.split("\\.", 2);
        String plural = crdMeta[0];
        String group = crdMeta[1];

        CustomResourceDefinitionContext context = new CustomResourceDefinitionContext
            .Builder()
            .withGroup(group)
            .withName(crdId)
            .withPlural(plural)
            .withVersion(version)
            .build();

        return context;
    }

    private NamespaceableResource<GenericKubernetesResource> fetchCustomResource(CustomResourceDefinitionContext context, String id, String namespace) {
        GenericKubernetesResourceList customResourceObjectList = client.genericKubernetesResources(context).inNamespace(namespace).list();
        for (GenericKubernetesResource cr : customResourceObjectList.getItems()) {
            if (cr.getMetadata().getName().equals(id)) {
                return client.resource(cr);
            }
        }
        return null;
    }

    private Set<ValidationMessage> validateCR(CustomResourceSchema schema, GenericKubernetesResource cr){
        //1. get CR spec as JsonNode
        JsonNode crAdditionalProps = cr.getAdditionalPropertiesNode();

        //2. get schema as JsonSchema
        ObjectMapper mapper = new ObjectMapper();
        JsonNode schemaNode = mapper.valueToTree(schema.getSchema());
        JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersionDetector.detect(schemaNode));
        JsonSchema jsonSchema = factory.getSchema(schemaNode);
        return jsonSchema.validate(crAdditionalProps);
    }

    public List<IdAwareCustomResource> findAll(String crdId, String namespace) {
        if(!crdService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        String version = crdService.fetchStoredVersionName(crdId);
        checkSchema(crdId, version);

        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        GenericKubernetesResourceList list = client.genericKubernetesResources(context).inNamespace(namespace).list();

        return list.getItems()
            .stream()
            .map(cr -> new IdAwareCustomResource(cr))
            .collect(Collectors.toList());
    }

    public IdAwareCustomResource findById(String crdId, String id, String namespace) {
        if(!crdService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        String version = crdService.fetchStoredVersionName(crdId);
        checkSchema(crdId, version);

        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
        if(cr == null) {
            throw new NoSuchElementException("No CR with this ID, CRD ID and version");
        }
        return new IdAwareCustomResource(cr.get());
    }

    public IdAwareCustomResource add(String crdId, IdAwareCustomResource request, String namespace) {
        if(!crdService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        //if version and schema are not found, these CRD and version do not exist in Kubernetes and an error is thrown
        String version = crdService.fetchStoredVersionName(crdId);
        CustomResourceSchema schema = checkSchema(crdId, version);

        //schema validation
        Set<ValidationMessage> errors = validateCR(schema, request.getCr());

        if (!errors.isEmpty()) {
            System.out.println(errors);
            throw new IllegalArgumentException("CR spec does not match the corresponding schema");
        }

        return new IdAwareCustomResource(client.resource(request.getCr()).inNamespace(namespace).create());
    }

    public IdAwareCustomResource update(String crdId, String id, IdAwareCustomResource request, String namespace) {
        if(!crdService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        //if version and schema are not found, these CRD and version do not exist in Kubernetes and an error is thrown
        String version = crdService.fetchStoredVersionName(crdId);
        CustomResourceSchema schema = checkSchema(crdId, version);

        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
        if(cr == null) {
            throw new NoSuchElementException("No CR with this ID, CRD ID and version");
        }
        
        //schema validation
        Set<ValidationMessage> errors = validateCR(schema, request.getCr());
        if (!errors.isEmpty()) {
            System.out.println(errors);
            throw new IllegalArgumentException("CR spec does not match the corresponding schema");
        }

        return new IdAwareCustomResource(client.resource(cr.get()).edit(object -> {
            object.setAdditionalProperties(request.getCr().getAdditionalProperties());
            System.out.println(object.getAdditionalPropertiesNode());
            return object;
        }));
    }

    public void delete(String crdId, String id, String namespace) {
        if(!crdService.isCrdAllowed(crdId)) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        //if version is not found, these CRD and version do not exist in Kubernetes and an error is thrown
        String version = crdService.fetchStoredVersionName(crdId);
        checkSchema(crdId, version);

        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
        if(cr != null) {
            cr.delete();
        }
    }
}
