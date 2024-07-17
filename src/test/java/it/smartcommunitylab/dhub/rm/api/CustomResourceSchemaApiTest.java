package it.smartcommunitylab.dhub.rm.api;


import com.fasterxml.jackson.databind.ObjectMapper;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.service.CustomResourceSchemaService;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class CustomResourceSchemaApiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomResourceSchemaService service;

    @MockBean
    private K8SPVCApi k8SPVCApi;

    @MockBean
    private K8SPVCService k8SPVCService;

    private final String crdId = "test";
    private final String version = "v1";

    CustomResourceSchemaDTO customResourceSchemaDTO;

    @BeforeEach
    public void setup() {

        customResourceSchemaDTO = new CustomResourceSchemaDTO();
        customResourceSchemaDTO.setCrdId(crdId);
        customResourceSchemaDTO.setVersion(version);

    }

    @Test
    public void testFindAll() throws Exception {

        Page<CustomResourceSchemaDTO> page = new PageImpl<>(
                Arrays.asList(customResourceSchemaDTO),
                PageRequest.of(0, 10),
                1
        );

        when(service.findAll(any(Collection.class), anyBoolean(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/crs")
                        .param("id", crdId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].crdId").value(crdId));

    }

    @Test
    public void testFindById() throws Exception {

        when(service.findById(ArgumentMatchers.eq(crdId))).thenReturn(customResourceSchemaDTO);

        mockMvc.perform(get("/api/crs/" + crdId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.crdId").value(crdId));
    }

    @Test
    public void testAdd() throws Exception {

        when(service.add(eq(null), any(CustomResourceSchemaDTO.class))).thenReturn(customResourceSchemaDTO);

        mockMvc.perform(post("/api/crs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(customResourceSchemaDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.crdId").value(crdId))
                .andExpect(jsonPath("$.version").value(version));
    }


    @Test
    public void testUpdate() throws Exception {

        when(service.update(eq(crdId), any(CustomResourceSchemaDTO.class))).thenReturn(customResourceSchemaDTO);

        mockMvc.perform(put("/api/crs/" + crdId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(customResourceSchemaDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.crdId").value(crdId))
                .andExpect(jsonPath("$.version").value(version));
    }

    @Test
    public void testDelete() throws Exception {
        doNothing().when(service).delete(ArgumentMatchers.eq(crdId));

        mockMvc.perform(delete("/api/crs/" + crdId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

    }



}
