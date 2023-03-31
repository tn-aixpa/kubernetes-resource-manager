package it.smartcommunitylab.dhub.rm.service;

import java.util.List;

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
}
