// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;
import jakarta.validation.constraints.Pattern;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
 * REST API controller for managing custom resources defined by Custom Resource Definitions (CRDs).
 * <p>
 * This controller provides endpoints to list, retrieve, create, update, and delete custom resources
 * within a specified Kubernetes namespace. Access to each operation is secured and requires appropriate
 * authorization as enforced by the security requirements and method-level access checks.
 * </p>
 *
 * <h2>Endpoints:</h2>
 * <ul>
 *   <li><b>GET /{crdId}</b>: List all custom resources for a given CRD, with optional filtering and pagination.</li>
 *   <li><b>GET /{crdId}/{id}</b>: Retrieve a single custom resource by CRD and resource ID.</li>
 *   <li><b>POST /{crdId}</b>: Create a new custom resource for a specified CRD.</li>
 *   <li><b>PUT /{crdId}/{id}</b>: Update an existing custom resource by CRD and resource ID.</li>
 *   <li><b>DELETE /{crdId}/{id}</b>: Delete a custom resource by CRD and resource ID.</li>
 * </ul>
 *
 * <h2>Security:</h2>
 * <ul>
 *   <li>Requires either Basic Authentication or JWT Authentication.</li>
 *   <li>Method-level authorization is enforced via the <code>@PreAuthorize</code> annotation and a custom authorization service.</li>
 * </ul>
 *
 * <h2>Parameters:</h2>
 * <ul>
 *   <li><b>crdId</b>: The identifier of the Custom Resource Definition (CRD).</li>
 *   <li><b>id</b>: The identifier of the custom resource instance (where applicable).</li>
 *   <li><b>namespace</b>: The Kubernetes namespace in which resources are managed (injected from configuration).</li>
 * </ul>
 *
 * <h2>Usage:</h2>
 * <p>
 * All endpoints are prefixed by the base API path defined in <code>SystemKeys.API_PATH</code>.
 * </p>
 *
 */
@RestController
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH)
@Validated
public class CustomResourceApi {

    @Autowired
    private CustomResourceService service;

    @Value("${kubernetes.namespace}")
    private String namespace;

    /**
     * Retrieve a list of all custom resources of given crdId.
     * The list can be filtered by ids.
     * @param crdId the custom resource definition id
     * @param id the optional list of resource ids
     * @param pageable the pagination parameters
     * @return a page containing the list of custom resources
     */
    @PreAuthorize("@authz.canAccess(#crdId, 'list')")
    @GetMapping("/{crdId}")
    public Page<IdAwareCustomResource> findAll(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(crdId, namespace, id, pageable);
    }

    /**
     * Retrieve a single custom resource given the crdId and the resource id.
     * @param crdId the custom resource definition id
     * @param id the resource id
     * @return the custom resource
     */
    @PreAuthorize("@authz.canAccess(#crdId, 'read')")
    @GetMapping("/{crdId}/{id}")
    public IdAwareCustomResource findById(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String id
    ) {
        return service.findById(crdId, id, namespace);
    }

    /**
     * Create a new custom resource for a specified custom resource definition (CRD).
     * Requires write access to the specified CRD.
     * @param crdId the custom resource definition id
     * @param request the custom resource to be created
     * @return the created custom resource with its assigned ID and details
     */

    @PreAuthorize("@authz.canAccess(#crdId, 'write')")
    @PostMapping("/{crdId}")
    public IdAwareCustomResource add(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @RequestBody IdAwareCustomResource request
    ) {
        return service.add(crdId, request, namespace);
    }

    /**
     * Update an existing custom resource with the specified id of the specified CRD.
     * Requires write access to the specified CRD.
     * @param crdId the custom resource definition id
     * @param id the custom resource id
     * @param request the custom resource to be updated
     * @return the updated custom resource
     */
    @PreAuthorize("@authz.canAccess(#crdId, 'write')")
    @PutMapping("/{crdId}/{id}")
    public IdAwareCustomResource update(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String id,
        @RequestBody IdAwareCustomResource request
    ) {
        return service.update(crdId, id, request, namespace);
    }

    /**
     * Delete a custom resource given the crdId and the resource id.
     * Requires write access to the specified CRD.
     * @param crdId the custom resource definition id
     * @param id the resource id
     */
    @PreAuthorize("@authz.canAccess(#crdId, 'write')")
    @DeleteMapping("/{crdId}/{id}")
    public void delete(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String id
    ) {
        service.delete(crdId, id, namespace);
    }
}
