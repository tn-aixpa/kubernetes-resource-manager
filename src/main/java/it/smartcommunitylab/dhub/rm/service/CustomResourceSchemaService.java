package it.smartcommunitylab.dhub.rm.service;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.converter.DTOToSchemaConverter;
import it.smartcommunitylab.dhub.rm.converter.SchemaToDTOConverter;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;
import jakarta.annotation.Nullable;
import jakarta.annotation.PostConstruct;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.LinkedList;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;

/**
 * Service for managing the custom schemas for CRDs
 */
@Service
public class CustomResourceSchemaService {

    public static final Logger logger = LoggerFactory.getLogger(CustomResourceSchemaService.class);

    private final CustomResourceSchemaRepository customResourceSchemaRepository;
    private final DTOToSchemaConverter dtoToSchemaConverter;
    private final SchemaToDTOConverter schemaToDTOConverter;
    private final CustomResourceDefinitionService crdService;
    private final AuthorizationService authService;
    
    public CustomResourceSchemaService(
        CustomResourceSchemaRepository customResourceSchemaRepository,
        CustomResourceDefinitionService crdService,
        AuthorizationService authService
    ) {
        this.customResourceSchemaRepository = customResourceSchemaRepository;
        this.dtoToSchemaConverter = new DTOToSchemaConverter();
        this.schemaToDTOConverter = new SchemaToDTOConverter();
        this.crdService = crdService;
        this.authService = authService;
    }

    /**
     * Load and stores pre-defined schemas from json files.
     */
    @PostConstruct
    public void bootstrapSchemas() {
        Page<IdAwareCustomResourceDefinition> crds = crdService.findAll(null, true, PageRequest.ofSize(1000));
        crds.forEach(crd -> {
            InputStream resource = getClass().getResourceAsStream("/schemas/" + crd.getId() +".json");
            if (resource != null) {
                CustomResourceSchemaDTO req = new CustomResourceSchemaDTO();
                req.setCrdId(crd.getId());
                req.setVersion(crdService.fetchStoredVersionName(crd.getCrd()));
                if (fetchByCrdIdAndVersion(req.getCrdId(), req.getVersion()).isEmpty()) {
                    try {
                        req.setSchemaAsString(new BufferedReader(new InputStreamReader(resource)).lines().collect(Collectors.joining("\n")));
                    } catch (JsonProcessingException e) {
                        logger.error("Error loading schema from file", e);
                    }
                    add(null, req);
                }
            }
        });
    }

    private Optional<CustomResourceSchema> fetchById(String id) {
        return customResourceSchemaRepository.findById(id);
    }

    private Optional<CustomResourceSchema> fetchByCrdIdAndVersion(String crdId, String version) {
        return customResourceSchemaRepository.findByCrdIdAndVersion(crdId, version);
    }

    /**
     * Find all schemas, potentially filtered by IDs. If 'all' parameter is set to false,
     * search only stored custom versions. Otherwise, take the schemas both from DB and from the CRD definition.
     * @param ids
     * @param all
     * @param pageable
     * @return
     */
    public Page<CustomResourceSchemaDTO> findAll(Collection<String> ids, boolean all, Pageable pageable) {
        if (ids == null && all) {
            // search for CRDs and their schemas
            Page<IdAwareCustomResourceDefinition> crds = crdService.findAll(null, false, pageable);
            List<CustomResourceSchemaDTO> schemaList = new LinkedList<>();
            crds.getContent().forEach(idCrd -> {
                CustomResourceDefinition crd = idCrd.getCrd();
                String crdId = crd.getMetadata().getName();
                String version = crdService.fetchStoredVersionName(crd);
                Optional<CustomResourceSchema> stored = fetchByCrdIdAndVersion(crdId, version);
                if (stored.isPresent()) {
                    schemaList.add(schemaToDTOConverter.convert(stored.get()));
                } else {
                    CustomResourceSchema schema = new CustomResourceSchema();
                    schema.setCrdId(crdId);
                    schema.setVersion(version);
                    schema.setSchema(crdService.getCrdSchema(crd));
                    schemaList.add(schemaToDTOConverter.convert(schema));
                }
            });
            return new PageImpl<>(schemaList, pageable, schemaList.size());
        } else if (ids == null) {
            Page<CustomResourceSchema> schemas = customResourceSchemaRepository.findAll(pageable);
            List<CustomResourceSchemaDTO> dtos = schemas
                .stream()
                .map(schemaToDTOConverter::convert)
                .collect(Collectors.toList());
            return new PageImpl<>(dtos, pageable, dtos.size());
        } else {
            Page<CustomResourceSchema> schemas = customResourceSchemaRepository.findByIdIn(ids, pageable);
            List<CustomResourceSchemaDTO> dtos = schemas
                .stream()
                .map(schemaToDTOConverter::convert)
                .collect(Collectors.toList());
            return new PageImpl<>(dtos, pageable, dtos.size());
        }
    }

    /**
     * Get schema by ID
     * @param id
     * @return
     */
    public CustomResourceSchemaDTO findById(String id) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if (!result.isPresent()) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_SCHEMA);
        }
        return schemaToDTOConverter.convert(result.get());
    }

    /**
     * Find schema by CRD and version. Check DB and if not exists, return K8S CRD definition.
     * @param crdId
     * @param version
     * @return
     */
    public CustomResourceSchemaDTO findByCrdIdAndVersion(String crdId, String version) {
        return schemaToDTOConverter.convert(findCRDByCrdIdAndVersion(crdId, version));
    }
    /**
     * Find schema by CRD and version. Check DB and if not exists, return K8S CRD definition.
     * @param crdId
     * @param version
     * @return
     */
    public CustomResourceSchema findCRDByCrdIdAndVersion(String crdId, String version) {
        Optional<CustomResourceSchema> result = fetchByCrdIdAndVersion(crdId, version);
        if (!result.isPresent()) {
            Map<String, Serializable> schemaMap = crdService.getCrdSchema(crdId, version);
            if (schemaMap != null) {
                CustomResourceSchema schema = new CustomResourceSchema();
                schema.setCrdId(crdId);
                schema.setVersion(version);
                schema.setSchema(schemaMap);
                return schema;
            }
            throw new NoSuchElementException(SystemKeys.ERROR_NO_SCHEMA_WITH_VERSION);
        }
        return result.get();
    }

    /**
     * Find all stored schemas for the specified CRD
     * @param crdId
     * @param pageable
     * @return
     */
    public Page<CustomResourceSchemaDTO> findByCrdId(String crdId, Pageable pageable) {
        Page<CustomResourceSchema> schemas = customResourceSchemaRepository.findByCrdId(crdId, pageable);
        List<CustomResourceSchemaDTO> dtos = schemas
            .stream()
            .map(schemaToDTOConverter::convert)
            .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, dtos.size());
    }

    /**
     * Create new schema
     * @param id
     * @param request
     * @return
     */
    public CustomResourceSchemaDTO add(@Nullable String id, CustomResourceSchemaDTO request) {
        if (!authService.isCrdAllowed(request.getCrdId())) {
            throw new AccessDeniedException(SystemKeys.ERROR_CRD_NOT_ALLOWED);
        }

        CustomResourceSchema result = dtoToSchemaConverter.convert(request);
        if (result == null) {
            throw new IllegalArgumentException(SystemKeys.ERROR_NULL_INPUT);
        }
        if (id != null) {
            if (fetchById(id).isPresent()) {
                throw new IllegalArgumentException(SystemKeys.ERROR_SCHEMA_EXISTS);
            }
            result.setId(id);
        } else {
            result.setId(UUID.randomUUID().toString());
        }

        if (!crdService.crdExists(request.getCrdId(), request.getVersion())) {
            throw new IllegalArgumentException(SystemKeys.ERROR_K8S_NO_CRD);
        }

        if (result.getSchema() == null || result.getSchema().isEmpty()) {
            //TODO al momento va aggiunto a mano il campo $schema per la validazione con la libreria
            result.setSchema(crdService.getCrdSchema(result.getCrdId(), result.getVersion()));
        }

        return schemaToDTOConverter.convert(customResourceSchemaRepository.save(result));
    }

    /**
     * Update existing schema.
     * @param id
     * @param request
     * @return
     */
    public CustomResourceSchemaDTO update(String id, CustomResourceSchemaDTO request) {
        Optional<CustomResourceSchema> result = fetchById(id);
        if (!result.isPresent()) {
            throw new NoSuchElementException(SystemKeys.ERROR_NO_SCHEMA);
        }
        CustomResourceSchema currentSchema = result.get();

        if (!crdService.crdExists(currentSchema.getCrdId(), currentSchema.getVersion())) {
            throw new IllegalArgumentException(SystemKeys.ERROR_K8S_NO_CRD);
        }

        CustomResourceSchema newSchema = dtoToSchemaConverter.convert(request);
        if (newSchema == null) {
            throw new IllegalArgumentException(SystemKeys.ERROR_NULL_INPUT);
        }
        currentSchema.setSchema(newSchema.getSchema());

        if (currentSchema.getSchema() == null || currentSchema.getSchema().isEmpty()) {
            currentSchema.setSchema(crdService.getCrdSchema(currentSchema.getCrdId(), currentSchema.getVersion()));
        }

        return schemaToDTOConverter.convert(customResourceSchemaRepository.save(currentSchema));
    }

    /**
     * Delete custom schema from DB
     * @param id
     */
    public void delete(String id) {
        if (fetchById(id).isPresent()) {
            customResourceSchemaRepository.deleteById(id);
        }
    }
}
