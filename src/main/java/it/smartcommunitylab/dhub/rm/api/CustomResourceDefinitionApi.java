package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.CustomResourceDefinitionPOJO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceDefinitionService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SystemKeys.API_PATH + "/crd")
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

    @GetMapping
    public List<CustomResourceDefinitionPOJO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CustomResourceDefinitionPOJO findById(@PathVariable String id) {
        return service.findById(id);
    }

    //TODO recuperare schema da Kubernetes o tramite CustomResourceSchemaService?
    @GetMapping("/{id}/schema")
    public String findSchemaForId(@PathVariable String id) {
        return null;
    }
}
