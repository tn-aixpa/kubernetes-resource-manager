package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import it.smartcommunitylab.dhub.rm.converter.DTOToSchemaConverter;
import it.smartcommunitylab.dhub.rm.converter.SchemaToDTOConverter;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;
import jakarta.annotation.Nullable;

//TODO per ogni operazione di scrittura tranne delete, verificare per prima cosa la consistenza (che crdId+versione esistano in Kubernetes)

@Service
public class CustomResourceSchemaService {
    private final CustomResourceSchemaRepository customResourceSchemaRepository;
    private final DTOToSchemaConverter dtoToSchemaConverter;
    private final SchemaToDTOConverter schemaToDTOConverter;

    public CustomResourceSchemaService(CustomResourceSchemaRepository customResourceSchemaRepository) {
        this.customResourceSchemaRepository = customResourceSchemaRepository;
        this.dtoToSchemaConverter = new DTOToSchemaConverter();
        this.schemaToDTOConverter = new SchemaToDTOConverter();
    }

    public Optional<CustomResourceSchema> fetchById(String id) {
        return customResourceSchemaRepository.findById(id);
    }

    public Optional<CustomResourceSchema> fetchByCrdIdAndVersion(String crdId, String version) {
        return customResourceSchemaRepository.findByCrdIdAndVersion(crdId, version);
    }

    public List<CustomResourceSchemaDTO> findAll() {
        return customResourceSchemaRepository.findAll()
                .stream()
                .map(schema -> schemaToDTOConverter.convert(schema))
                .collect(Collectors.toList());
    }

    public CustomResourceSchemaDTO findById(String id) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if(!result.isPresent()) {
            throw new NoSuchElementException("No schema with this ID");
        }
        return schemaToDTOConverter.convert(result.get());
    }

    public CustomResourceSchemaDTO findByCrdIdAndVersion(String crdId, String version) {
        Optional<CustomResourceSchema> result = fetchByCrdIdAndVersion(crdId, version);
        if(!result.isPresent()) {
            throw new NoSuchElementException("No schema with this CRD ID and version");
        }
        return schemaToDTOConverter.convert(result.get());
    }

    public List<CustomResourceSchemaDTO> findByCrdId(String crdId) {
        return customResourceSchemaRepository.findByCrdId(crdId)
                .stream()
                .map(schema -> schemaToDTOConverter.convert(schema))
                .collect(Collectors.toList());
    }

    public CustomResourceSchemaDTO add(@Nullable String id, CustomResourceSchemaDTO request) {
        CustomResourceSchema result = dtoToSchemaConverter.convert(request);
        if(id != null) {
            if (fetchById(id).isPresent()) {
                throw new IllegalArgumentException("Schema with this ID already exists");
            }
            result.setId(id);
        } else {
            result.setId(UUID.randomUUID().toString());
        }
        
        return schemaToDTOConverter.convert(customResourceSchemaRepository.save(result));
    }

    public CustomResourceSchemaDTO update(String id, CustomResourceSchemaDTO request) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if (!result.isPresent()) {
            throw new NoSuchElementException("No schema with this ID");
        }
        CustomResourceSchema currentSchema = result.get();
        CustomResourceSchema newSchema = dtoToSchemaConverter.convert(request);
        currentSchema.setSchema(newSchema.getSchema());
        return schemaToDTOConverter.convert(customResourceSchemaRepository.save(currentSchema));
    }

    public void delete(String id) {
        if(fetchById(id).isPresent()) {
            customResourceSchemaRepository.deleteById(id);
        }
    }
}
