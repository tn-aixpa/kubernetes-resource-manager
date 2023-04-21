package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import it.smartcommunitylab.dhub.rm.service.CustomResourceDefinitionService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;

//TODO usare regex per le path variables? (es. {crdId:" + SystemKeys.REGEX_CRD_ID + "}"), NOTA: producono 404 se non matched
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
    private CustomResourceDefinitionService crdService;
    @Value("${namespace}")
    private String namespace;

    @GetMapping
    public List<IdAwareCustomResource> findAll(@PathVariable String crdId) {
        return service.findAll(crdId, crdService.fetchStoredVersion(crdId), namespace);
    }

    @GetMapping("/{id}")
    public IdAwareCustomResource findById(@PathVariable String crdId, @PathVariable String id) {
        return service.findById(crdId, id, crdService.fetchStoredVersion(crdId), namespace);
    }

    @PostMapping
    public IdAwareCustomResource add(@PathVariable String crdId, @RequestBody GenericKubernetesResource request) {
        //TODO per usare IdAwareCustomResource come RequestBody serve clonarlo in GenericKubernetesResource nel service, altrimenti il client cerca l'endpoint /IdAwareCustomResource
        return service.add(crdId, request, crdService.fetchStoredVersion(crdId), namespace);
    }

    @PutMapping("/{id}")
    public IdAwareCustomResource update(@PathVariable String crdId, @PathVariable String id, @RequestBody GenericKubernetesResource request) {
        return service.update(crdId, id, request, crdService.fetchStoredVersion(crdId), namespace);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String crdId, @PathVariable String id) {
        service.delete(crdId, id, crdService.fetchStoredVersion(crdId), namespace);
    }
}
