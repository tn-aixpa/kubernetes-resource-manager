// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.api;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

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

import io.fabric8.kubernetes.api.model.Secret;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.service.K8SSecretService;

/**
 * API for K8S Secret
 * 
 * <p>
 * This API provides operations to manipulate K8S Secret
 * </p>
 *
 */
@RestController
@PreAuthorize("@authz.canAccess('k8s_secret', 'list')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/k8s_secret")
@Validated
public class K8SSecretApi {

    @Autowired
    private K8SSecretService service;

    @Value("${kubernetes.namespace}")
    private String namespace;

    /**
     * List K8S Secret
     * 
     * @param id list of secret id to filter. If null, all secrets will be returned
     * @param pageable pagination parameters
     * @return a page of K8S Secret
     */
    @PreAuthorize("@authz.canAccess('k8s_secret', 'list')")
    @GetMapping
    public Page<IdAwareResource<Secret>> findAll(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(namespace, id, pageable);
    }

    /**
     * Get a specific K8S Secret
     * 
     * @param secretId the id of the secret to retrieve
     * @return the K8S Secret
     */
    @PreAuthorize("@authz.canAccess('k8s_secret', 'read')")
    @GetMapping("/{secretId}")
    public IdAwareResource<Secret> findById(@PathVariable String secretId) {
        return service.findById(namespace, secretId);
    }

    /**
     * Decode a specific key in a K8S Secret
     * 
     * @param secretId the id of the secret to decode
     * @param key the key to decode
     * @return a map with the decoded value
     */
    @PreAuthorize("@authz.canAccess('k8s_secret', 'read')")
    @GetMapping("/{secretId}/decode/{key:.*}")
    public Map<String, String> decodeSecret(@PathVariable String secretId, @PathVariable String key) {
        return Collections.singletonMap(key,  service.decode(namespace, secretId, key));
    }

}
