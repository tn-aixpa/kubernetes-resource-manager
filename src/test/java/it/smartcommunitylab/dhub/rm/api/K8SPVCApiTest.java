package it.smartcommunitylab.dhub.rm.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.PersistentVolumeClaim;
import io.fabric8.kubernetes.api.model.PersistentVolumeClaimBuilder;
import io.fabric8.kubernetes.api.model.storage.StorageClass;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.model.dto.PersistentVolumeClaimDTO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
import it.smartcommunitylab.dhub.rm.service.CustomResourceService;
import it.smartcommunitylab.dhub.rm.service.K8SPVCService;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class K8SPVCApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private K8SPVCService service;

    @MockBean
    CustomResourceApi customResourceApi;

    @MockBean
    CustomResourceService customResourceService;

    @MockBean
    CustomResourceSchemaService customResourceSchemaService;

    private final String name = "pvc";
    private final String namespace = "namespace";

    @Test
    public void testFindAll() throws Exception {

        PersistentVolumeClaim pvc = new PersistentVolumeClaimBuilder()
                .withNewMetadata().withName(name).withNamespace(namespace).endMetadata()
                .build();

        IdAwareResource<PersistentVolumeClaim> idAwareResource = new IdAwareResource<>(pvc);

        Page<IdAwareResource<PersistentVolumeClaim>> page = new PageImpl<>(
                Arrays.asList(idAwareResource),
                PageRequest.of(0, 10),
                1
        );

        when(service.findAll(anyString(), any(Collection.class), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/k8s_pvc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].metadata.name").value(name))
                .andExpect(jsonPath("$.content[0].metadata.namespace").value(namespace));

    }

    @Test
    public void testFindById() throws Exception {

        PersistentVolumeClaim pvc = new PersistentVolumeClaimBuilder()
                .withNewMetadata().withName(name).withNamespace(namespace).endMetadata()
                .build();

        IdAwareResource<PersistentVolumeClaim> idAwareResource = new IdAwareResource<>(pvc);

        when(service.findById(anyString(), anyString())).thenReturn(idAwareResource);

        mockMvc.perform(get("/api/k8s_pvc/" + name)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metadata.name").value(name));

    }

    @Test
    public void testAdd() throws Exception {
        PersistentVolumeClaimDTO pvcDTO = new PersistentVolumeClaimDTO();
        pvcDTO.setName(name);

        PersistentVolumeClaim pvc = new PersistentVolumeClaimBuilder()
                .withNewMetadata().withName(name).withNamespace(namespace).endMetadata()
                .build();

        IdAwareResource<PersistentVolumeClaim> idAwareResource = new IdAwareResource<>(pvc);

        when(service.add(anyString(), any(PersistentVolumeClaimDTO.class))).thenReturn(idAwareResource);

        mockMvc.perform(post("/api/k8s_pvc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(pvcDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metadata.name").value(name))
                .andExpect(jsonPath("$.metadata.namespace").value(namespace));
    }


    @Test
    public void testDelete() throws Exception {
        doNothing().when(service).delete(ArgumentMatchers.eq(namespace), ArgumentMatchers.eq(name));

        mockMvc.perform(delete("/api/k8s_pvc/" + name)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetStorageClasses() throws Exception {

        String storageName = "storage-name";

        ObjectMeta metadata = new ObjectMeta();
        metadata.setName(storageName);

        StorageClass storageClass = new StorageClass();
        storageClass.setMetadata(metadata);

        IdAwareResource<StorageClass> idAwareResource = new IdAwareResource<>(storageClass);

        when(service.listStorageClasses()).thenReturn(Arrays.asList(idAwareResource));

        mockMvc.perform(get("/api/k8s_storageclass")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].metadata.name").value(storageName));
    }

}
