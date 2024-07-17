package it.smartcommunitylab.dhub.rm.api;

import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.Service;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;
import it.smartcommunitylab.dhub.rm.service.K8SPVCService;
import it.smartcommunitylab.dhub.rm.service.K8SSvcService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class K8SServiceApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private K8SSvcService service;

    @MockBean
    CustomResourceApi customResourceApi;

    @MockBean
    CustomResourceService customResourceService;

    @MockBean
    CustomResourceSchemaService customResourceSchemaService;

    @MockBean
    private K8SPVCApi k8SPVCApi;

    @MockBean
    private K8SPVCService k8SPVCService;

    private final String name = "pvc";
    private final String namespace = "namespace";

    ObjectMeta meta;
    Service service1;
    IdAwareResource<Service> idAwareResource;

    @BeforeEach
    public void setup() {
        meta = new ObjectMeta();
        meta.setNamespace(namespace);
        meta.setName(name);

        service1 = new Service();
        service1.setMetadata(meta);

        idAwareResource = new IdAwareResource<>(service1);

    }

    @Test
    public void testFindAll() throws Exception {

        Page<IdAwareResource<Service>> page = new PageImpl<>(
                Arrays.asList(idAwareResource),
                PageRequest.of(0, 10),
                1
        );

        when(service.findAll(anyString(), any(Collection.class), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/k8s_service")
                        .contentType(MediaType.APPLICATION_JSON)
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].metadata.name").value(name))
                .andExpect(jsonPath("$.content[0].metadata.namespace").value(namespace));

    }

    @Test
    public void testFindById() throws Exception {

        when(service.findById(anyString(), anyString())).thenReturn(idAwareResource);

        mockMvc.perform(get("/api/k8s_service/" + name)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metadata.name").value(name));

    }

}
