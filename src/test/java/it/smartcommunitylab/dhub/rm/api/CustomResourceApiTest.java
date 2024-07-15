package it.smartcommunitylab.dhub.rm.api;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;
import it.smartcommunitylab.dhub.rm.service.K8SPVCService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
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

    @BeforeEach
    public void setup() {

    }

    @Test
    public void testFindAll() throws Exception {

        ObjectMeta meta = new ObjectMeta();
        meta.setName(name);
        GenericKubernetesResource genericResource1 = new GenericKubernetesResource();
        genericResource1.setMetadata(meta);

        IdAwareCustomResource resource = new IdAwareCustomResource(genericResource1);
        resource.setId(id);

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

        ObjectMeta meta = new ObjectMeta();
        meta.setName(name);
        GenericKubernetesResource genericResource = new GenericKubernetesResource();
        genericResource.setMetadata(meta);
        IdAwareCustomResource resource = new IdAwareCustomResource(genericResource);
        resource.setId(id);

        when(customResourceService.findById(crdId, id, namespace)).thenReturn(resource);

        mockMvc.perform(get("/api/" + crdId + "/" + id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.metadata.name").value(name));

    }

    @Test
    public void testAdd() throws Exception {
        ObjectMeta meta = new ObjectMeta();
        meta.setName(name);
        GenericKubernetesResource genericResource = new GenericKubernetesResource();
        genericResource.setMetadata(meta);
        IdAwareCustomResource resource = new IdAwareCustomResource(genericResource);
        resource.setId(id);

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

        String newName = "updated-resource";

        ObjectMeta meta = new ObjectMeta();
        meta.setName(newName);
        GenericKubernetesResource genericResource = new GenericKubernetesResource();
        genericResource.setMetadata(meta);
        IdAwareCustomResource updatedResource = new IdAwareCustomResource(genericResource);
        updatedResource.setId(id);


        when(customResourceService.update(ArgumentMatchers.eq(crdId), ArgumentMatchers.eq(id), any(IdAwareCustomResource.class), ArgumentMatchers.eq(namespace)))
                .thenReturn(updatedResource);

        mockMvc.perform(put("/api/" + crdId + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"" + id + "\", \"metadata\":{\"name\":\"" + newName +"\"}}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.metadata.name").value(newName));

    }

    @Test
    public void testDelete() throws Exception {
        doNothing().when(customResourceService).delete(ArgumentMatchers.eq(crdId), ArgumentMatchers.eq(id), ArgumentMatchers.eq(namespace));

        mockMvc.perform(delete("/api/" + crdId + "/" + id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }

}
