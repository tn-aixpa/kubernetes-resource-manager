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

import io.fabric8.kubernetes.api.model.ResourceQuota;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.service.K8SQuotaService;
import jakarta.validation.constraints.Pattern;

/**
 * API for managing K8S Quota resources.
 *
 */
@RestController
@PreAuthorize("@authz.canAccess('k8s_quota', 'list')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/k8s_quota")
@Validated
public class K8SQuotaApi {

    /**
     * Service for K8S Quota
     */
    @Autowired
    private K8SQuotaService service;
    
    /**
     * Default namespace for k8s resources
     */
    @Value("${kubernetes.namespace}")
    private String namespace;

    /**
     * List K8S Quota resources matching given criteria.
     * 
     * @param id optional list of IDs for filtering
     * @param pageable pagination params
     * @return list of K8S Quota resources
     */
    @PreAuthorize("@authz.canAccess('k8s_quota', 'list')")
    @GetMapping
    public Page<IdAwareResource<ResourceQuota>> findAll(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(namespace, id, pageable);
    }

    /**
     * Get single K8S Quota resource by ID.
     * 
     * @param quotaId ID of the resource
     * @return K8S Quota resource
     */
    @PreAuthorize("@authz.canAccess('k8s_quota', 'read')")
    @GetMapping("/{quotaId}")
    public IdAwareResource<ResourceQuota> findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String quotaId) {
        return service.findById(namespace, quotaId);
    }
}
