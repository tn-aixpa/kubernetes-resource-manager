package it.smartcommunitylab.dhub.rm.api;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;
import it.smartcommunitylab.dhub.rm.service.K8SPVCService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collection;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class CustomResourceApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomResourceService customResourceService;

    @MockBean
    private CustomResourceSchemaService customResourceSchemaService;

    @MockBean
    private K8SPVCService k8sPVCService;

    private final String crdId = "example-crd.id";
    private final String namespace = "default";
    private final String name = "resource1";
    private final String id = "1";

    ObjectMeta meta;
    GenericKubernetesResource genericResource;
    IdAwareCustomResource resource;

    @BeforeEach
    public void setup() {

        meta = new ObjectMeta();
        meta.setName(name);
        genericResource = new GenericKubernetesResource();
        genericResource.setMetadata(meta);

        resource = new IdAwareCustomResource(genericResource);
        resource.setId(id);

    }

    @Test
    public void testFindAll() throws Exception {

        Page<IdAwareCustomResource> page = new PageImpl<>(
                Arrays.asList(resource),
                PageRequest.of(0, 10),
                1
        );

        when(customResourceService.findAll(ArgumentMatchers.eq(crdId), ArgumentMatchers.eq(namespace), any(Collection.class), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/" + crdId)
                        .param("id", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value("1"))
                .andExpect(jsonPath("$.content[0].metadata.name").value(name));
    }

    @Test
    public void testFindById() throws Exception {

        when(customResourceService.findById(crdId, id, namespace)).thenReturn(resource);

        mockMvc.perform(get("/api/" + crdId + "/" + id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.metadata.name").value(name));

    }

    @Test
    public void testAdd() throws Exception {

        when(customResourceService.add(ArgumentMatchers.eq(crdId), any(IdAwareCustomResource.class), ArgumentMatchers.eq(namespace)))
                .thenReturn(resource);

        mockMvc.perform(post("/api/" + crdId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"" + id + "\", \"metadata\":{\"name\":\"" + name +"\"}}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.metadata.name").value(name));

    }

    @Test
    public void testUpdate() throws Exception {

        when(customResourceService.update(ArgumentMatchers.eq(crdId), ArgumentMatchers.eq(id), any(IdAwareCustomResource.class), ArgumentMatchers.eq(namespace)))
                .thenReturn(resource);

        mockMvc.perform(put("/api/" + crdId + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"" + id + "\", \"metadata\":{\"name\":\"" + name +"\"}}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.metadata.name").value(name));

    }

    @Test
    public void testDelete() throws Exception {
        doNothing().when(customResourceService).delete(ArgumentMatchers.eq(crdId), ArgumentMatchers.eq(id), ArgumentMatchers.eq(namespace));

        mockMvc.perform(delete("/api/" + crdId + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }

    //Test Exceptions
    @Test
    public void testFindByIdNotFound() throws Exception {
        when(customResourceService.findById(crdId, id, namespace)).thenThrow(new NoSuchElementException("Resource not found"));

        mockMvc.perform(get("/api/" + crdId + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Resource not found"));
    }

}
