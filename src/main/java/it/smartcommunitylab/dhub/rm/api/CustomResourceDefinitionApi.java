package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceDefinitionService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import jakarta.validation.constraints.Pattern;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SystemKeys.API_PATH + "/crd")
@Validated
public class CustomResourceDefinitionApi {
    /*
        CustomResourceDefinition
        GET /crd/ => list / search + pagination (come query param)
        GET /crd/{id} => get ONE by id
        GET /crd/{id}/schema => get schema for CRD

        id: [metadata.name] === [spec.names.plural+"."+spec.group]
    */

    @Autowired
    private CustomResourceDefinitionService service;
    @Autowired
    private CustomResourceSchemaService schemaService;

    @GetMapping
    public List<IdAwareCustomResourceDefinition> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public IdAwareCustomResourceDefinition findById(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/schema")
    public CustomResourceSchemaDTO findSchemaForId(@PathVariable @Pattern(regexp = SystemKeys.REGEX_CRD_ID) String id) {
        return schemaService.findByCrdIdAndVersion(id, service.fetchStoredVersionName(id));
    }
}
