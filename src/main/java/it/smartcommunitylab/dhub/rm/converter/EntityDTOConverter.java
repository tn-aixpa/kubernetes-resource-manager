package it.smartcommunitylab.dhub.rm.converter;

import java.io.Serializable;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;

public class EntityDTOConverter {
    
    public static CustomResourceSchemaDTO fromEntity(CustomResourceSchema source) {
        CustomResourceSchemaDTO dto = new CustomResourceSchemaDTO();
        
        dto.setId(source.getId());
        dto.setCrdId(source.getCrdId());
        dto.setVersion(source.getVersion());
        
        ObjectMapper mapper = new ObjectMapper();
        dto.setSchema(mapper.valueToTree(source.getSchema()));
        
        return dto;
    }
    
    public static CustomResourceSchema fromDTO(CustomResourceSchemaDTO source) {
        CustomResourceSchema entity = new CustomResourceSchema();
        
        entity.setCrdId(source.getCrdId());
        entity.setVersion(source.getVersion());
        
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Serializable> schema = mapper.convertValue(source.getSchema(), new TypeReference<Map<String, Serializable>>(){});
        entity.setSchema(schema);
        
        return entity;
    }
}
