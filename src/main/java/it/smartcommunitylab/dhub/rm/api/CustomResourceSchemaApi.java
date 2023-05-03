package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@PreAuthorize("hasAuthority(@authenticationProperties.getPrefix() + @authenticationProperties.getRole())")
@RequestMapping(SystemKeys.API_PATH + "/crs")
@Validated
public class CustomResourceSchemaApi {

    @Autowired
    private CustomResourceSchemaService service;

    @GetMapping
    public List<CustomResourceSchemaDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CustomResourceSchemaDTO findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_SCHEMA_ID) String id) {
        return service.findById(id);
    }

    @PostMapping
    public CustomResourceSchemaDTO add(@RequestParam(required = false) String id, @Valid @RequestBody CustomResourceSchemaDTO request) {
        return service.add(id, request);
    }

    @PutMapping("/{id}")
    public CustomResourceSchemaDTO update(@PathVariable @Pattern(regexp = SystemKeys.REGEX_SCHEMA_ID) String id, @Valid @RequestBody CustomResourceSchemaDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @Pattern(regexp = SystemKeys.REGEX_SCHEMA_ID) String id) {
        service.delete(id);
    }
}
