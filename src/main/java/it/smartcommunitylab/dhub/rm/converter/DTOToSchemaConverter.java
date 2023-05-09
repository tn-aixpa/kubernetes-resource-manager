package it.smartcommunitylab.dhub.rm.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import org.springframework.core.convert.converter.Converter;

public class DTOToSchemaConverter implements Converter<CustomResourceSchemaDTO, CustomResourceSchema> {

    private static final ObjectMapper mapper = new ObjectMapper();
    private static final TypeReference<HashMap<String, Serializable>> typeRef =
        new TypeReference<HashMap<String, Serializable>>() {};

    @Override
    public CustomResourceSchema convert(CustomResourceSchemaDTO source) {
        if (source == null) {
            return null;
        }
        CustomResourceSchema entity = new CustomResourceSchema();

        entity.setCrdId(source.getCrdId());
        entity.setVersion(source.getVersion());

        Map<String, Serializable> schema = mapper.convertValue(source.getSchema(), typeRef);
        entity.setSchema(schema);

        return entity;
    }
}
