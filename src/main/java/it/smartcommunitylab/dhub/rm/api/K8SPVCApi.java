// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.api;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.fabric8.kubernetes.api.model.PersistentVolumeClaim;
import io.fabric8.kubernetes.api.model.storage.StorageClass;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.model.dto.PersistentVolumeClaimDTO;
import it.smartcommunitylab.dhub.rm.service.K8SPVCService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

@RestController
@PreAuthorize("@authz.canAccess('k8s_pvc', 'list')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH)
@Validated
public class K8SPVCApi {

    @Autowired
    private K8SPVCService service;
    
    @Value("${kubernetes.namespace}")
    private String namespace;

    @PreAuthorize("@authz.canAccess('k8s_pvc', 'list')")
    @GetMapping("/k8s_pvc")
    public Page<IdAwareResource<PersistentVolumeClaim>> findAll(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(namespace, id, pageable);
    }

    @PreAuthorize("@authz.canAccess('k8s_pvc', 'read')")
    @GetMapping("/k8s_pvc/{pvcId}")
    public IdAwareResource<PersistentVolumeClaim> findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String pvcId) {
        return service.findById(namespace, pvcId);
    }

    @PreAuthorize("@authz.canAccess('k8s_pvc', 'write')")
    @PostMapping("/k8s_pvc")
    public IdAwareResource<PersistentVolumeClaim> add(
        @Valid @RequestBody PersistentVolumeClaimDTO request
    ) {
        return service.add(namespace, request);
    }

    @PreAuthorize("@authz.canAccess('k8s_pvc', 'write')")
    @DeleteMapping("/k8s_pvc/{pvcId}")
    public void delete(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String pvcId) {
        service.delete(namespace, pvcId);
    }

    
    @GetMapping("/k8s_storageclass")
    @PreAuthorize("@authz.canAccess('k8s_pvc', 'list')")
    public Page<IdAwareResource<StorageClass>> getStorageClasses(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return new PageImpl<>(service.listStorageClasses());
    }


}
