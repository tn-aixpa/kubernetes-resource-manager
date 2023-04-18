package it.smartcommunitylab.dhub.rm.model;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;

public class CustomResourceDefinitionPOJO {
    CustomResourceDefinition crd;
    String id;

    public CustomResourceDefinitionPOJO(CustomResourceDefinition crd) {
        this.crd = crd;
        this.id = crd.getMetadata().getName();
    }

    public String getId() {
        return id;
    }

    public CustomResourceDefinition getCrd() {
        return crd;
    }
}
