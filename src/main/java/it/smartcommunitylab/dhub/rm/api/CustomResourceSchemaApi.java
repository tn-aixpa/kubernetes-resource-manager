// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller for managing Custom Resource Schemas (CRS).
 * <p>
 * Provides endpoints to list, search, add, update and delete custom resource schemas.
 * <ul>
 *   <li>GET /crs/ - List custom resource schemas, with optional pagination and filtering.</li>
 *   <li>GET /crs/{id} - Retrieve a specific custom resource schema by its identifier.</li>
 *   <li>POST /crs/ - Add a new custom resource schema.</li>
 *   <li>PUT /crs/{id} - Update a custom resource schema by its identifier.</li>
 *   <li>DELETE /crs/{id} - Delete a custom resource schema by its identifier.</li>
 * </ul>
 * <p>
 * Security:
 * <ul>
 *   <li>Requires user to have 'ROLE_USER' authority.</li>
 *   <li>Supports both Basic Authentication and JWT Authentication.</li>
 * </ul>
 * <p>
 * The schema identifier format is: <code>[metadata.name]</code>
 *
 */
@RestController
@PreAuthorize("hasAuthority('ROLE_USER')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/crs")
@Validated
public class CustomResourceSchemaApi {

    @Autowired
    private CustomResourceSchemaService service;

    /**
     * Retrieves all custom resource schemas.
     *
     * @param id Optional, the id of the schema to search for.
     * @param all Optional, if true, returns all schemas, otherwise only returns the custom schemas.
     * @param pageable Optional, pagination parameters.
     * @return A page containing a list of custom resource schemas.
     */
    @GetMapping
    public Page<CustomResourceSchemaDTO> findAll(
        @RequestParam(required = false) Collection<String> id,
        @RequestParam(required = false) Boolean all,
        Pageable pageable
    ) {
        return service.findAll(id, Boolean.TRUE.equals(all), pageable);
    }

    /**
     * Retrieves a custom resource schema by its identifier.
     *
     * @param id The identifier of the schema to retrieve.
     * @return The custom resource schema.
     */
    @GetMapping("/{id}")
    public CustomResourceSchemaDTO findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_SCHEMA_ID) String id) {
        return service.findById(id);
    }

    /**
     * Adds a new custom resource schema.
     *
     * @param id Optional, the id of the schema to add.
     * @param request The custom resource schema to add.
     * @return The added custom resource schema.
     */
    @PreAuthorize("@authz.canAccess('crs', 'write')")
    @PostMapping
    public CustomResourceSchemaDTO add(
        @RequestParam(required = false) String id,
        @Valid @RequestBody CustomResourceSchemaDTO request
    ) {
        return service.add(id, request);
    }

    /**
     * Updates a custom resource schema by its identifier.
     *
     * @param id The identifier of the schema to update.
     * @param request The custom resource schema to update.
     * @return The updated custom resource schema.
     */
    @PreAuthorize("@authz.canAccess('crs', 'write')")
    @PutMapping("/{id}")
    public CustomResourceSchemaDTO update(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_SCHEMA_ID) String id,
        @Valid @RequestBody CustomResourceSchemaDTO request
    ) {
        return service.update(id, request);
    }

    /**
     * Deletes a custom resource schema by its identifier.
     *
     * @param id The identifier of the schema to delete.
     */
    @PreAuthorize("@authz.canAccess('crs', 'write')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable @Pattern(regexp = SystemKeys.REGEX_SCHEMA_ID) String id) {
        service.delete(id);
    }
}
