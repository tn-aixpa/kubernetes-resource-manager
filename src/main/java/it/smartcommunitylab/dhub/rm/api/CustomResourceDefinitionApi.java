package it.smartcommunitylab.dhub.rm.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceDefinitionService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import jakarta.validation.constraints.Pattern;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("hasAuthority('ROLE_USER')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/crd")
@Validated
public class CustomResourceDefinitionApi {

    /*
        CustomResourceDefinition
        GET /crd/ => list / search + pagination (come query param)
        GET /crd/{id} => get ONE by id
        GET /crd/{id}/schema => get schema for CRD

        id: [metadata.name] === [spec.names.plural+"."+spec.group]
    */

    @Autowired
    private CustomResourceDefinitionService service;

    @Autowired
    private CustomResourceSchemaService schemaService;

    @GetMapping
    public Page<IdAwareCustomResourceDefinition> findAll(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(id, pageable);
    }

    @GetMapping("/{id}")
    public IdAwareCustomResourceDefinition findById(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id
    ) {
        return service.findById(id);
    }

    @GetMapping("/{id}/schema")
    public CustomResourceSchemaDTO findSchemaForId(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id) {
        return schemaService.findByCrdIdAndVersion(id, service.fetchStoredVersionName(id));
    }

    @GetMapping("/{id}/schemas")
    public Page<CustomResourceSchemaDTO> findSchemasForId(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id,
        Pageable pageable
    ) {
        return schemaService.findByCrdId(id, pageable);
    }
}
