package it.smartcommunitylab.dhub.rm.model;

import java.io.Serializable;
import java.util.Map;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.persistence.Convert;
import it.smartcommunitylab.dhub.rm.converter.SerializableMapConverter;

@Entity
public class CustomResourceSchema {
    @Id
    private String id;

    @Column(name = "crd_id")
    private String crdId;

    private String version;

    @Lob
    @Convert(converter = SerializableMapConverter.class)
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
