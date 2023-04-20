package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;

@RestController
@RequestMapping(SystemKeys.API_PATH + "/cr/{crdId}")
public class CustomResourceApi {
    /*
    GET /cr/{crdId} => list / search + pagination (come query param)
    GET /cr/{crdId}/{id} => get ONE by id
    POST /cr/{crdId}  => create new (opt id)
    PUT /cr/{crdId}/{id} => update/create with id
    DELETE /cr/{crdId}/{id} => delete ONE by id
    */

    @Autowired
    private CustomResourceService service;
    @Autowired
    private CustomResourceSchemaService schemaService;

    @GetMapping
    public List<IdAwareCustomResource> findAll(@PathVariable String crdId) {
        //TODO verificare se fetchStoredVersion deve essere dichiarato in una classe a parte o se chiamarlo direttamente nel service
        return service.findAll(crdId, schemaService.fetchStoredVersion(crdId));
    }

    @GetMapping("/{id}")
    public IdAwareCustomResource findById(@PathVariable String crdId, @PathVariable String id) {
        return service.findById(crdId, id, schemaService.fetchStoredVersion(crdId));
    }

    @PostMapping
    public IdAwareCustomResource add(@PathVariable String crdId, @RequestBody GenericKubernetesResource request) {
        //TODO using IdAwareCustomResource as RequestBody gives error
        return service.add(crdId, request, schemaService.fetchStoredVersion(crdId));
    }

    @PutMapping("/{id}")
    public IdAwareCustomResource update(@PathVariable String crdId, @PathVariable String id, @RequestBody GenericKubernetesResource request) {
        return service.update(crdId, id, request, schemaService.fetchStoredVersion(crdId));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String crdId, @PathVariable String id) {
        service.delete(crdId, id, schemaService.fetchStoredVersion(crdId));
    }
}
