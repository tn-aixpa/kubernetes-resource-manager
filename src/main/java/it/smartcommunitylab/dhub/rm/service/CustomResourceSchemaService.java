package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import it.smartcommunitylab.dhub.rm.converter.DTOToSchemaConverter;
import it.smartcommunitylab.dhub.rm.converter.SchemaToDTOConverter;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;
import jakarta.annotation.Nullable;

@Service
public class CustomResourceSchemaService {
    private final CustomResourceSchemaRepository customResourceSchemaRepository;
    private final DTOToSchemaConverter dtoToSchemaConverter;
    private final SchemaToDTOConverter schemaToDTOConverter;
    private final CustomResourceDefinitionService crdService;
    private final AuthorizationService authService;

    public CustomResourceSchemaService(CustomResourceSchemaRepository customResourceSchemaRepository, CustomResourceDefinitionService crdService, AuthorizationService authService) {
        this.customResourceSchemaRepository = customResourceSchemaRepository;
        this.dtoToSchemaConverter = new DTOToSchemaConverter();
        this.schemaToDTOConverter = new SchemaToDTOConverter();
        this.crdService = crdService;
        this.authService = authService;
    }

    private Optional<CustomResourceSchema> fetchById(String id) {
        return customResourceSchemaRepository.findById(id);
    }

    public Optional<CustomResourceSchema> fetchByCrdIdAndVersion(String crdId, String version) {
        return customResourceSchemaRepository.findByCrdIdAndVersion(crdId, version);
    }

    public Page<CustomResourceSchemaDTO> findAll(Pageable pageable) {
        Page<CustomResourceSchema> schemas = customResourceSchemaRepository.findAll(pageable);
        List<CustomResourceSchemaDTO> dtos = schemas.stream()
                .map(schema -> schemaToDTOConverter.convert(schema))
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, dtos.size());
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

    // public List<CustomResourceSchemaDTO> findByCrdId(String crdId) {
    //     return customResourceSchemaRepository.findByCrdId(crdId)
    //             .stream()
    //             .map(schema -> schemaToDTOConverter.convert(schema))
    //             .collect(Collectors.toList());
    // }

    public CustomResourceSchemaDTO add(@Nullable String id, CustomResourceSchemaDTO request) {
        if(!authService.isCrdAllowed(request.getCrdId())) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        CustomResourceSchema result = dtoToSchemaConverter.convert(request);
        if(id != null) {
            if (fetchById(id).isPresent()) {
                throw new IllegalArgumentException("Schema with this ID already exists");
            }
            result.setId(id);
        } else {
            result.setId(UUID.randomUUID().toString());
        }

        if(!crdService.crdExists(request.getCrdId(), request.getVersion())) {
            throw new IllegalArgumentException("No such CRD exists in Kubernetes");
        }

        if(result.getSchema() == null || result.getSchema().isEmpty()) {
            //TODO al momento va aggiunto a mano il campo $schema per la validazione con la libreria
            result.setSchema(crdService.getCrdSchema(result.getCrdId(), result.getVersion()));
        }
        
        return schemaToDTOConverter.convert(customResourceSchemaRepository.save(result));
    }

    public CustomResourceSchemaDTO update(String id, CustomResourceSchemaDTO request) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if (!result.isPresent()) {
            throw new NoSuchElementException("No schema with this ID");
        }
        CustomResourceSchema currentSchema = result.get();

        if(!crdService.crdExists(currentSchema.getCrdId(), currentSchema.getVersion())) {
            throw new IllegalArgumentException("No such CRD exists in Kubernetes");
        }

        CustomResourceSchema newSchema = dtoToSchemaConverter.convert(request);
        currentSchema.setSchema(newSchema.getSchema());

        if(currentSchema.getSchema() == null || currentSchema.getSchema().isEmpty()) {
            currentSchema.setSchema(crdService.getCrdSchema(currentSchema.getCrdId(), currentSchema.getVersion()));
        }

        return schemaToDTOConverter.convert(customResourceSchemaRepository.save(currentSchema));
    }

    public void delete(String id) {
        if(fetchById(id).isPresent()) {
            customResourceSchemaRepository.deleteById(id);
        }
    }
}
