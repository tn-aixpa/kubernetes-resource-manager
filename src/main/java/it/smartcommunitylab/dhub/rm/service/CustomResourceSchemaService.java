package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;

@Service
public class CustomResourceSchemaService {
    @Autowired
    private CustomResourceSchemaRepository customResourceSchemaRepository;

    public List<CustomResourceSchemaDTO> findCustomResourceSchemas() {
        return customResourceSchemaRepository.findAll()
                .stream()
                .map(schema -> CustomResourceSchemaDTO.from(schema))
                .collect(Collectors.toList());
    }

    public CustomResourceSchemaDTO findById(String id) {
        Optional<CustomResourceSchema> result = customResourceSchemaRepository.findById(id);
        if (result.isPresent()) {
            System.out.println(result.get().getSchema());
            return CustomResourceSchemaDTO.from(result.get());
        } else {
            return null;
        }
    }

    public CustomResourceSchemaDTO create(CustomResourceSchemaDTO request) {
        CustomResourceSchema result = CustomResourceSchemaDTO.to(request);
        System.out.println(result.getSchema());
        result.setId(UUID.randomUUID().toString());
        return CustomResourceSchemaDTO.from(customResourceSchemaRepository.save(result));
    }

    public CustomResourceSchemaDTO update(String id, CustomResourceSchemaDTO request) {
        //TODO create if resource dows not exist?
        Optional<CustomResourceSchema> result = customResourceSchemaRepository.findById(id);
        if (result.isPresent()) {
            CustomResourceSchema schema = CustomResourceSchemaDTO.to(request);
            schema.setId(id);
            return CustomResourceSchemaDTO.from(customResourceSchemaRepository.save(schema));
        } else {
            throw new IllegalArgumentException("Resource not found");
        }
    }

    public void delete(String id) {
        customResourceSchemaRepository.deleteById(id);
    }
}
