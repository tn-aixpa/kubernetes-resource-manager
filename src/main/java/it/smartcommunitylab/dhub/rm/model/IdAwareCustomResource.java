package it.smartcommunitylab.dhub.rm.model;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;

public class IdAwareCustomResource extends GenericKubernetesResource {
    String id;

    public IdAwareCustomResource(GenericKubernetesResource cr) {
        super();
        this.setApiVersion(cr.getApiVersion());
        this.setKind(cr.getKind());
        this.setMetadata(cr.getMetadata());
        this.setAdditionalProperties(cr.getAdditionalProperties());
        this.id = cr.getMetadata().getName();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
