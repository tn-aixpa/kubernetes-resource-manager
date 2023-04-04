package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;
import jakarta.annotation.Nullable;

@Service
public class CustomResourceSchemaService {
    private final CustomResourceSchemaRepository customResourceSchemaRepository;

    public CustomResourceSchemaService(CustomResourceSchemaRepository customResourceSchemaRepository) {
        this.customResourceSchemaRepository = customResourceSchemaRepository;
    }

    public List<CustomResourceSchemaDTO> findAll() {
        return customResourceSchemaRepository.findAll()
                .stream()
                .map(schema -> CustomResourceSchemaDTO.from(schema))
                .collect(Collectors.toList());
    }

    public Optional<CustomResourceSchema> fetchById(String id) {
        return customResourceSchemaRepository.findById(id);
    }

    public CustomResourceSchemaDTO findById(String id) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if(!result.isPresent()) {
            throw new NoSuchElementException("No schema with this ID");
        }
        return CustomResourceSchemaDTO.from(result.get());
    }

    public Optional<CustomResourceSchema> fetchByCrdIdAndVersion(String crdId, String version) {
        return customResourceSchemaRepository.findByCrdIdAndVersion(crdId, version);
    }

    public CustomResourceSchemaDTO findByCrdIdAndVersion(String crdId, String version) {
        Optional<CustomResourceSchema> result = fetchByCrdIdAndVersion(crdId, version);
        if(!result.isPresent()) {
            throw new NoSuchElementException("No schema with this CRD ID and version");
        }
        return CustomResourceSchemaDTO.from(result.get());
    }

    public List<CustomResourceSchemaDTO> findByCrdId(String crdId) {
        return customResourceSchemaRepository.findByCrdId(crdId)
                .stream()
                .map(schema -> CustomResourceSchemaDTO.from(schema))
                .collect(Collectors.toList());
    }

    public CustomResourceSchemaDTO findLatest(String crdId) {
        //TODO get active version from kubernetes
        return null;
    }

    public CustomResourceSchemaDTO add(@Nullable String id, CustomResourceSchemaDTO request) {
        CustomResourceSchema result = CustomResourceSchemaDTO.to(request);
        if(id != null) {
            if (fetchById(id).isPresent()) {
                throw new IllegalArgumentException("Schema with this ID already exists");
            }
            result.setId(id);
        } else {
            result.setId(UUID.randomUUID().toString());
        }
        
        return CustomResourceSchemaDTO.from(customResourceSchemaRepository.save(result));
    }

    public CustomResourceSchemaDTO update(String id, CustomResourceSchemaDTO request) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if (!result.isPresent()) {
            throw new NoSuchElementException("No schema with this ID");
        }
        CustomResourceSchema schema = CustomResourceSchemaDTO.to(request);
        schema.setId(id);
        return CustomResourceSchemaDTO.from(customResourceSchemaRepository.save(schema));
    }

    public void delete(String id) {
        if(fetchById(id).isPresent()) {
            customResourceSchemaRepository.deleteById(id);
        }
    }
}
