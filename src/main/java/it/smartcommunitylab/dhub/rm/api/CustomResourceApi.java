package it.smartcommunitylab.dhub.rm.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;
import jakarta.validation.constraints.Pattern;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("hasAuthority(@authenticationProperties.getPrefix() + @authenticationProperties.getRole())") //TODO aggiornare
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH)
@Validated
public class CustomResourceApi {

    @Autowired
    private CustomResourceService service;

    @Value("${namespace}")
    private String namespace;

    @GetMapping("/{crdId}")
    public Page<IdAwareCustomResource> findAll(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        Pageable pageable
    ) {
        return service.findAll(crdId, namespace, pageable);
    }

    @GetMapping("/{crdId}/{id}")
    public IdAwareCustomResource findById(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String id
    ) {
        return service.findById(crdId, id, namespace);
    }

    @PostMapping("/{crdId}")
    public IdAwareCustomResource add(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @RequestBody IdAwareCustomResource request
    ) {
        return service.add(crdId, request, namespace);
    }

    @PutMapping("/{crdId}/{id}")
    public IdAwareCustomResource update(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String id,
        @RequestBody IdAwareCustomResource request
    ) {
        return service.update(crdId, id, request, namespace);
    }

    @DeleteMapping("/{crdId}/{id}")
    public void delete(
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String crdId,
        @PathVariable @Pattern(regexp = SystemKeys.REGEX_CR_ID) String id
    ) {
        service.delete(crdId, id, namespace);
    }
}
