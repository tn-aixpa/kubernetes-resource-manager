package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.GenericKubernetesResourceList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.NamespaceableResource;
import io.fabric8.kubernetes.client.dsl.base.CustomResourceDefinitionContext;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;

@Service
public class CustomResourceService {
    private final KubernetesClient client;

    public CustomResourceService(KubernetesClient client) {
        Assert.notNull(client, "Client required");
        this.client = client;
    }

    public CustomResourceDefinitionContext createCrdContext(String crdId, String version) {
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

    public NamespaceableResource<GenericKubernetesResource> fetchCustomResource(CustomResourceDefinitionContext context, String id, String namespace) {
        GenericKubernetesResourceList customResourceObjectList = client.genericKubernetesResources(context).inNamespace(namespace).list();
        for (GenericKubernetesResource cr : customResourceObjectList.getItems()) {
            if (cr.getMetadata().getName().equals(id)) {
                return client.resource(cr);
            }
        }
        return null;
    }

    public List<IdAwareCustomResource> findAll(String crdId, String version, String namespace) {
        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        GenericKubernetesResourceList list = client.genericKubernetesResources(context).inNamespace(namespace).list();

        return list.getItems()
            .stream()
            .map(cr -> new IdAwareCustomResource(cr))
            .collect(Collectors.toList());
    }

    public IdAwareCustomResource findById(String crdId, String id, String version, String namespace) {
        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
        if(cr == null) {
            throw new NoSuchElementException("No CR with this ID");
        }
        return new IdAwareCustomResource(cr.get());
    }

    public IdAwareCustomResource add(String crdId, GenericKubernetesResource request, String version, String namespace) {
        // GenericKubernetesResource cr = new GenericKubernetesResource();
        // cr.setApiVersion(request.getApiVersion());
        // cr.setKind(request.getKind());
        // cr.setMetadata(request.getMetadata());
        // cr.setAdditionalProperties(request.getAdditionalProperties());
        // return new IdAwareCustomResource(client.resource(cr).create());
        //TODO implement validation
        return new IdAwareCustomResource(client.resource(request).inNamespace(namespace).create());
    }

    public IdAwareCustomResource update(String crdId, String id, GenericKubernetesResource request, String version, String namespace) {
        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        GenericKubernetesResource cr = fetchCustomResource(context, id, namespace).get();
        return new IdAwareCustomResource(client.resource(cr).edit(object -> {
            object.setAdditionalProperties(request.getAdditionalProperties());
            System.out.println(object.getAdditionalPropertiesNode());
            return object;
        }));
        // return new IdAwareCustomResource(client.resource(cr).patch(request));
    }

    public void delete(String crdId, String id, String version, String namespace) {
        CustomResourceDefinitionContext context = createCrdContext(crdId, version);
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);
        if(cr != null) {
            cr.delete();
        }
    }
}
