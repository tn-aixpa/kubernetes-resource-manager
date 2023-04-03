package it.smartcommunitylab.dhub.rm.model.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;

public class CustomResourceSchemaDTO {
    private String id;
    private Map<String, String> metadata;
    private Map<String, Object> spec;

    public static CustomResourceSchemaDTO from(CustomResourceSchema source) {
        CustomResourceSchemaDTO dto = new CustomResourceSchemaDTO();
        Map<String, String> metadata = new HashMap<String, String>();
        Map<String, Object> spec = new HashMap<String, Object>();

        metadata.put("name", source.getCrdId());

        String group = source.getCrdId().split("\\.", 2)[1];
        spec.put("group", group);

        List<Map<String, Object>> versions = new ArrayList<Map<String, Object>>();
        //TODO multiple versions?
        //TODO change Object type to Serializable?
        Map<String, Object> version = new HashMap<String, Object>();
        version.put("name", source.getVersion());
        version.put("schema", source.getSchema());
        versions.add(version);

        Map<String, String> names = new HashMap<String, String>();
        names.put("plural", source.getCrdId().split("\\.", 2)[0]);

        spec.put("versions", versions);
        spec.put("names", names);
        dto.setMetadata(metadata);
        dto.setSpec(spec);
        dto.setId(source.getId());

        return dto;
    }

    public static CustomResourceSchema to(CustomResourceSchemaDTO source) {
        CustomResourceSchema schema = new CustomResourceSchema();
        Map<String, String> metadata = source.getMetadata();
        Map<String, Object> spec = source.getSpec();
        Map<String, Object> version = ((List<Map<String, Object>>) spec.get("versions")).get(0);

        schema.setCrdId(metadata.get("name"));
        schema.setVersion((String)version.get("name"));
        schema.setSchema((Map<String, Serializable>)version.get("schema"));

        return schema;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public Map<String, Object> getSpec() {
        return spec;
    }

    public void setSpec(Map<String, Object> spec) {
        this.spec = spec;
    }
}
