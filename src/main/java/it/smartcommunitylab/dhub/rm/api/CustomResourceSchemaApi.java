package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping(SystemKeys.API_PATH + "/crs")
public class CustomResourceSchemaApi {
    //TODO add calls to findByCrdId and findByCrdIdAndVersion ?

    @Autowired
    private CustomResourceSchemaService service;

    @GetMapping
    public List<CustomResourceSchemaDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CustomResourceSchemaDTO findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public CustomResourceSchemaDTO add(@RequestParam(required = false) String id, @RequestBody CustomResourceSchemaDTO request) {
        return service.add(id, request);
    }

    @PutMapping("/{id}")
    public CustomResourceSchemaDTO update(@PathVariable String id, @RequestBody CustomResourceSchemaDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
