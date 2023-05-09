package it.smartcommunitylab.dhub.rm.model.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotBlank;

public class CustomResourceSchemaDTO {

    private String id;

    @NotBlank
    private String crdId;

    @NotBlank
    private String version;

    private JsonNode schema;

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

    @JsonIgnore
    public JsonNode getSchema() {
        return schema;
    }

    @JsonIgnore
    public void setSchema(JsonNode schema) {
        this.schema = schema;
    }

    @JsonGetter("schema")
    public String getSchemaAsString() {
        if (schema != null) {
            return schema.asText();
        }
        return null;
    }

    @JsonSetter("schema")
    public void setSchemaAsString(String schema) throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        if (schema != null) {
            this.schema = objectMapper.readValue(schema, JsonNode.class);
        } else {
            this.schema = null;
        }
    }
}
