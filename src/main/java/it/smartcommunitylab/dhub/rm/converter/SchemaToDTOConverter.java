// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import org.springframework.core.convert.converter.Converter;

public class SchemaToDTOConverter implements Converter<CustomResourceSchema, CustomResourceSchemaDTO> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public CustomResourceSchemaDTO convert(CustomResourceSchema source) {
        if (source == null) {
            return null;
        }
        CustomResourceSchemaDTO dto = new CustomResourceSchemaDTO();

        dto.setId(source.getId());
        dto.setCrdId(source.getCrdId());
        dto.setVersion(source.getVersion());

        dto.setSchema(mapper.valueToTree(source.getSchema()));

        return dto;
    }
}
