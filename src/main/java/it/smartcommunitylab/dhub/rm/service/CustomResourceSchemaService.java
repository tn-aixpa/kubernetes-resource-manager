package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import it.smartcommunitylab.dhub.rm.converter.EntityDTOConverter;
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
                .map(schema -> EntityDTOConverter.fromEntity(schema))
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
        return EntityDTOConverter.fromEntity(result.get());
    }

    public Optional<CustomResourceSchema> fetchByCrdIdAndVersion(String crdId, String version) {
        return customResourceSchemaRepository.findByCrdIdAndVersion(crdId, version);
    }

    public CustomResourceSchemaDTO findByCrdIdAndVersion(String crdId, String version) {
        Optional<CustomResourceSchema> result = fetchByCrdIdAndVersion(crdId, version);
        if(!result.isPresent()) {
            throw new NoSuchElementException("No schema with this CRD ID and version");
        }
        return EntityDTOConverter.fromEntity(result.get());
    }

    public List<CustomResourceSchemaDTO> findByCrdId(String crdId) {
        return customResourceSchemaRepository.findByCrdId(crdId)
                .stream()
                .map(schema -> EntityDTOConverter.fromEntity(schema))
                .collect(Collectors.toList());
    }

    public CustomResourceSchemaDTO findLatest(String crdId) {
        //TODO get active version from kubernetes
        return null;
    }

    public CustomResourceSchemaDTO add(@Nullable String id, CustomResourceSchemaDTO request) {
        CustomResourceSchema result = EntityDTOConverter.fromDTO(request);
        if(id != null) {
            if (fetchById(id).isPresent()) {
                throw new IllegalArgumentException("Schema with this ID already exists");
            }
            result.setId(id);
        } else {
            result.setId(UUID.randomUUID().toString());
        }
        
        return EntityDTOConverter.fromEntity(customResourceSchemaRepository.save(result));
    }

    public CustomResourceSchemaDTO update(String id, CustomResourceSchemaDTO request) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if (!result.isPresent()) {
            throw new NoSuchElementException("No schema with this ID");
        }
        CustomResourceSchema schema = EntityDTOConverter.fromDTO(request);
        // TODO
        // Consentire solo modifica di schema? O anche di crdId e version (che però dovrebbero essere una chiave univoca?
        // Se consentiamo solo la modifica dello schema, creare un metodo pubic in EntityDTOConverter per conversione JsonNode->Map?
        // Fare classe a parte per questa conversione (per non mescolare DTO<->Entity)? Package a parte per non mescolare converter DB?
        schema.setId(id);
        return EntityDTOConverter.fromEntity(customResourceSchemaRepository.save(schema));
    }

    public void delete(String id) {
        if(fetchById(id).isPresent()) {
            customResourceSchemaRepository.deleteById(id);
        }
    }
}
