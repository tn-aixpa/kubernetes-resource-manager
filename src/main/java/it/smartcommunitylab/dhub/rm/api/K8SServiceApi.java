// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.api;

import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.fabric8.kubernetes.api.model.Service;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.service.K8SSvcService;
import jakarta.validation.constraints.Pattern;

/**
 * Controller for managing K8S Service resources.
 * 
 * <p>
 * This API provides operations to list, read, create, update and delete K8S Service resources.
 * </p>
 * 
 * <p>
 * The API is secured through Basic Authentication and JWT.
 * </p>
 */
@RestController
@PreAuthorize("@authz.canAccess('k8s_service', 'list')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/k8s_service")
@Validated
public class K8SServiceApi {

    @Autowired
    private K8SSvcService service;
    
    @Value("${kubernetes.namespace}")
    private String namespace;

    /**
     * List all K8S Service resources.
     * 
     * @param id optional list of IDs for filtering
     * @param pageable pagination parameters
     * @return a page of K8S Service resources
     */
    @PreAuthorize("@authz.canAccess('k8s_service', 'list')")
    @GetMapping
    public Page<IdAwareResource<Service>> findAll(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(namespace, id, pageable);
    }

    /**
     * Get a single K8S Service resource by ID.
     * 
     * @param serviceId ID of the resource
     * @return a single K8S Service resource
     */
    @PreAuthorize("@authz.canAccess('k8s_service', 'read')")
    @GetMapping("/{serviceId}")
    public IdAwareResource<Service> findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String serviceId) {
        return service.findById(namespace, serviceId);
    }
}
