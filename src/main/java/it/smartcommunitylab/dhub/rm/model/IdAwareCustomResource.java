// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.model;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import org.springframework.util.Assert;

public class IdAwareCustomResource {

    private String id;

    @JsonUnwrapped
    private GenericKubernetesResource cr;

    protected IdAwareCustomResource() {}

    public IdAwareCustomResource(GenericKubernetesResource cr) {
        Assert.notNull(cr, "CR is required");
        this.id = cr.getMetadata().getName();
        this.cr = cr;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public GenericKubernetesResource getCr() {
        return cr;
    }

    public void setCr(GenericKubernetesResource cr) {
        this.cr = cr;
    }
}
