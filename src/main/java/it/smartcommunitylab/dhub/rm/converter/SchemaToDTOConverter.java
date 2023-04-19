package it.smartcommunitylab.dhub.rm.converter;

import org.springframework.core.convert.converter.Converter;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SchemaToDTOConverter implements Converter<CustomResourceSchema, CustomResourceSchemaDTO>{
    @Override
    public CustomResourceSchemaDTO convert(CustomResourceSchema source) {
        CustomResourceSchemaDTO dto = new CustomResourceSchemaDTO();
        
        dto.setId(source.getId());
        dto.setCrdId(source.getCrdId());
        dto.setVersion(source.getVersion());
        
        ObjectMapper mapper = new ObjectMapper();
        dto.setSchema(mapper.valueToTree(source.getSchema()));
        
        return dto;
    }
}
