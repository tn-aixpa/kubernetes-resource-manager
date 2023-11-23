package it.smartcommunitylab.dhub.rm.model;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import io.fabric8.kubernetes.api.model.Service;

import org.springframework.util.Assert;

public class IdAwareService {

    private String id;

    @JsonUnwrapped
    private Service service;

    protected IdAwareService() {}

    public IdAwareService(Service service) {
        Assert.notNull(service, "Service is required");
        this.id = service.getMetadata().getName();
        this.service = service;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }
}
