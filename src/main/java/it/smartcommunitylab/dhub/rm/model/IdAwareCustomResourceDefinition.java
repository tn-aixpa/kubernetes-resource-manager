package it.smartcommunitylab.dhub.rm.model;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;

public class IdAwareCustomResourceDefinition extends CustomResourceDefinition {
    String id;

    public IdAwareCustomResourceDefinition(CustomResourceDefinition crd) {
        super(crd.getApiVersion(), crd.getKind(), crd.getMetadata(), crd.getSpec(), crd.getStatus());
        this.setAdditionalProperties(crd.getAdditionalProperties());
        this.id = crd.getMetadata().getName();
    }

    public String getId() {
        return id;
    }
}
