package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;

@Service
public class CustomResourceSchemaService {
    @Autowired
    private CustomResourceSchemaRepository customResourceSchemaRepository;

    public List<CustomResourceSchema> findCustomResourceSchemas() {
        return customResourceSchemaRepository.findAll();
    }

    public CustomResourceSchema findById(String id) {
        Optional<CustomResourceSchema> result = customResourceSchemaRepository.findById(id);
        if (result.isPresent()) {
            return result.get();
        } else {
            return null;
        }
    }

    public CustomResourceSchema create(CustomResourceSchema request) {
        CustomResourceSchema result = new CustomResourceSchema();
        result.setId(UUID.randomUUID().toString());
        result.setCrdId(request.getCrdId());
        result.setVersion(request.getVersion());
        result.setSchema(request.getSchema());
        return customResourceSchemaRepository.save(result);
    }

    public CustomResourceSchema update(String id, CustomResourceSchema request) {
        //TODO create if resource dows not exist?
        Optional<CustomResourceSchema> result = customResourceSchemaRepository.findById(id);
        if (result.isPresent()) {
            CustomResourceSchema schema = result.get();
            schema.setCrdId(request.getCrdId());
            schema.setVersion(request.getVersion());
            schema.setSchema(request.getSchema());
            return customResourceSchemaRepository.save(schema);
        } else {
            throw new IllegalArgumentException("Resource not found");
        }
    }

    public void delete(String id) {
        customResourceSchemaRepository.deleteById(id);
    }
}
