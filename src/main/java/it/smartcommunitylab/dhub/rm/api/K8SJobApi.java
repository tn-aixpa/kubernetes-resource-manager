// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.api;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.fabric8.kubernetes.api.model.batch.v1.Job;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.service.K8SJobService;
import jakarta.validation.constraints.Pattern;

/**
 * API for K8S Job
 * 
 * <p>
 * This API provides operations to manipulate K8S Job
 * </p>
 * 
 */
@RestController
@PreAuthorize("@authz.canAccess('k8s_job', 'list')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/k8s_job")
@Validated
public class K8SJobApi {

    /**
     * Service for K8S Job
     */
    @Autowired
    private K8SJobService service;

    /**
     * K8S namespace
     */
    @Value("${kubernetes.namespace}")
    private String namespace;

    /**
     * Get the list of all K8S Job
     * 
     * @param id
     *            the id of the K8S Job
     * @param pageable
     *            the pagination information
     * @return the list of K8S Job
     */
    @PreAuthorize("@authz.canAccess('k8s_job', 'list')")
    @GetMapping
    public Page<IdAwareResource<Job>> findAll(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(namespace, id, pageable);
    }

    /**
     * Get a K8S Job by its id
     * 
     * @param jobId
     *            the id of the K8S Job
     * @return the K8S Job
     */
    @PreAuthorize("@authz.canAccess('k8s_job', 'read')")
    @GetMapping("/{jobId}")
    public IdAwareResource<Job> findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String jobId) {
        return service.findById(namespace, jobId);
    }

    /**
     * Get the log of a K8S Job
     * 
     * @param jobId
     *            the id of the K8S Job
     * @return the log of the K8S Job
     */
    @PreAuthorize("@authz.canAccess('k8s_job', 'read')")
    @GetMapping("/{jobId}/log")
    public List<String> getLog(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String jobId) {
        return service.getLog(namespace, jobId);
    }

    /**
     * Delete a K8S Job
     * 
     * @param jobId
     *            the id of the K8S Job
     */
    @PreAuthorize("@authz.canAccess('k8s_job', 'write')")
    @DeleteMapping("/{jobId}")
    public void delete(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String jobId) {
        service.delete(namespace, jobId);
    }
}
