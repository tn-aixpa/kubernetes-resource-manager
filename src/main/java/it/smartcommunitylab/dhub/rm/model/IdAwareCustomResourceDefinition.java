package it.smartcommunitylab.dhub.rm.model;

import org.springframework.util.Assert;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;

public class IdAwareCustomResourceDefinition extends CustomResourceDefinition {
    private String id;

    protected IdAwareCustomResourceDefinition(){}

    public IdAwareCustomResourceDefinition(CustomResourceDefinition crd) {
        super();
        Assert.notNull(crd, "CRD is required");
        this.setApiVersion(crd.getApiVersion());
        this.setKind(crd.getKind());
        this.setMetadata(crd.getMetadata());
        this.setSpec(crd.getSpec());
        this.setStatus(crd.getStatus());
        this.setAdditionalProperties(crd.getAdditionalProperties());
        this.id = crd.getMetadata().getName();
    }

    public String getId() {
        return id;
    }
}
