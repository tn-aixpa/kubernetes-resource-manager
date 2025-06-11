// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.model;

import it.smartcommunitylab.dhub.rm.converter.MapConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.Map;

@Entity
@Table(name = "custom_resource_schema", uniqueConstraints = @UniqueConstraint(columnNames = { "crd_id", "version" }))
public class CustomResourceSchema {

    @Id
    private String id;

    @Column(name = "crd_id", nullable = false)
    private String crdId;

    @Column(nullable = false)
    private String version;

    @Lob
    @Column(name = "crd_schema")
    @Convert(converter = MapConverter.class)
    private Map<String, Serializable> schema;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCrdId() {
        return crdId;
    }

    public void setCrdId(String crdId) {
        this.crdId = crdId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Map<String, Serializable> getSchema() {
        return schema;
    }

    public void setSchema(Map<String, Serializable> schema) {
        this.schema = schema;
    }
}
