package it.smartcommunitylab.dhub.rm.model;

import org.springframework.util.Assert;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;

public class IdAwareCustomResource extends GenericKubernetesResource {
    //TODO annotare come required con regex
    private String id;

    protected IdAwareCustomResource(){}

    public IdAwareCustomResource(GenericKubernetesResource cr) {
        Assert.notNull(cr, "CR is required");
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
