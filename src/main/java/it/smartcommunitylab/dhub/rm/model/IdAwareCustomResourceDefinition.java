package it.smartcommunitylab.dhub.rm.model;

import org.springframework.util.Assert;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;

public class IdAwareCustomResourceDefinition {
    private String id;
    @JsonUnwrapped
    private CustomResourceDefinition crd;

    protected IdAwareCustomResourceDefinition(){}

    public IdAwareCustomResourceDefinition(CustomResourceDefinition crd) {
        Assert.notNull(crd, "CRD is required");
        this.id = crd.getMetadata().getName();
        this.crd = crd;
    }

    public String getId() {
        return id;
    }

    public CustomResourceDefinition getCrd() {
        return crd;
    }
}
