package it.smartcommunitylab.dhub.rm.api;

import java.util.Collection;
import java.util.List;

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

import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.service.K8SDeploymentService;
import jakarta.validation.constraints.Pattern;

@RestController
@PreAuthorize("hasAuthority('ROLE_USER')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/k8s_deployment")
@Validated
public class K8SDeploymentApi {

    @Autowired
    private K8SDeploymentService service;
    
    @Value("${kubernetes.namespace}")
    private String namespace;

    @GetMapping
    public Page<IdAwareResource<Deployment>> findAll(
        @RequestParam(required = false) Collection<String> id,
        Pageable pageable
    ) {
        return service.findAll(namespace, id, pageable);
    }

    @GetMapping("/{deploymentId}")
    public IdAwareResource<Deployment> findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String deploymentId) {
        return service.findById(namespace, deploymentId);
    }

    @GetMapping("/{deploymentId}/log")
    public List<String>  getLog(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String deploymentId) {
        return service.getLog(namespace, deploymentId);
    }

}
