// SPDX-License-Identifier: Apache-2.0
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

/**
 * REST API controller for managing Custom Resource Definitions (CRDs).
 * <p>
 * Provides endpoints to list, search, and retrieve CRDs and their associated schemas.
 * <ul>
 *   <li>GET /crd/ - List or search CRDs with optional pagination and filtering.</li>
 *   <li>GET /crd/{id} - Retrieve a specific CRD by its identifier.</li>
 *   <li>GET /crd/{id}/schema - Retrieve the schema for a specific CRD and its stored version.</li>
 *   <li>GET /crd/{id}/schemas - List all schemas associated with a specific CRD, with pagination support.</li>
 * </ul>
 * <p>
 * Security:
 * <ul>
 *   <li>Requires user to have 'ROLE_USER' authority.</li>
 *   <li>Supports both Basic Authentication and JWT Authentication.</li>
 * </ul>
 * <p>
 * The CRD identifier format is: <code>[metadata.name] == [spec.names.plural + "." + spec.group]</code>
 *
 */
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

/**
 * Retrieve a paginated list of all Custom Resource Definitions (CRDs).
 * The list can be optionally filtered by a collection of CRD IDs and whether they lack schemas.
 * 
 * @param id Optional collection of CRD IDs to filter the results.
 * @param onlyWithoutSchema If true, filters only CRDs without stored custom schemas.
 * @param pageable Pagination parameters for the request.
 * @return A page containing a list of CRDs matching the criteria.
 */

    @GetMapping
    public Page<IdAwareCustomResourceDefinition> findAll(
        @RequestParam(required = false) Collection<String> id,
        @RequestParam(required = false) boolean onlyWithoutSchema,
        Pageable pageable
    ) {
        return service.findAll(id, onlyWithoutSchema, pageable);
    }

    /**
     * Retrieve a single Custom Resource Definition (CRD) given its identifier.
     * @param id the CRD identifier
     * @return the CRD
     */
    @GetMapping("/{id}")
    public IdAwareCustomResourceDefinition findById(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id
    ) {
        return service.findById(id);
    }

    /**
     * Retrieve the schema for a specific CRD and its stored version.
     * @param id the CRD identifier
     * @return the schema for the CRD
     */
    @GetMapping("/{id}/schema")
    public CustomResourceSchemaDTO findSchemaForId(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id) {
        return schemaService.findByCrdIdAndVersion(id, service.fetchStoredVersionName(id));
    }

    /**
     * Retrieve a paginated list of all custom schemas stored for a specific CRD.
     * @param id the CRD identifier
     * @param pageable Pagination parameters for the request.
     * @return A page containing a list of custom schemas for the CRD.
     */
    @GetMapping("/{id}/schemas")
    public Page<CustomResourceSchemaDTO> findSchemasForId(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id,
        Pageable pageable
    ) {
        return schemaService.findByCrdId(id, pageable);
    }
}
