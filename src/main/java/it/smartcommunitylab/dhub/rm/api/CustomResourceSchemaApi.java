package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SystemKeys.API_PATH + "/crs")
public class CustomResourceSchemaApi {
    /*
        GET /crs/ => list / search + pagination (come query param)
        GET /crs/{id} => get ONE by id
        POST /crs => create new (opt id)
        PUT /crs/{id} => update/create with id
        DELETE /crs/{id} => delete ONE by id
     */

    @Autowired
    private CustomResourceSchemaService service;

    @GetMapping
    public List<CustomResourceSchema> find() {
        return service.findCustomResourceSchemas();
    }

    @GetMapping("/{id}")
    public String findById(@PathVariable String id) {
        return "This is a test";
    }

    @PostMapping
    public String create() {
        return "This is a test";
    }

    @PutMapping("/{id}")
    public String update(@PathVariable String id) {
        return "This is a test";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        return "This is a test";
    }
}
