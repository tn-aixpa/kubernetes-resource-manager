// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.model;

import org.springframework.util.Assert;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

import io.fabric8.kubernetes.api.model.HasMetadata;

public class IdAwareResource<T extends HasMetadata> {

    private String id;

    @JsonUnwrapped
    private T resource;

    protected IdAwareResource() {}

    public IdAwareResource(T resource) {
        Assert.notNull(resource, "Resource is required");
        this.id = resource.getMetadata().getName();
        this.resource = resource;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public T getResource() {
        return resource;
    }

    public void setResource(T resource) {
        this.resource = resource;
    }
    
}
