package it.smartcommunitylab.dhub.rm.converter;

import java.io.Serializable;
import java.util.Map;

import org.springframework.core.convert.converter.Converter;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class DTOToSchemaConverter implements Converter<CustomResourceSchemaDTO, CustomResourceSchema>{
    @Override
    public CustomResourceSchema convert(CustomResourceSchemaDTO source) {
        CustomResourceSchema entity = new CustomResourceSchema();
        
        entity.setCrdId(source.getCrdId());
        entity.setVersion(source.getVersion());
        
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Serializable> schema = mapper.convertValue(source.getSchema(), new TypeReference<Map<String, Serializable>>(){});
        entity.setSchema(schema);
        
        return entity;
    }
}
