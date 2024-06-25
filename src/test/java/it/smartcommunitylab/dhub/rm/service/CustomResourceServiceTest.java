package it.smartcommunitylab.dhub.rm.service;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionBuilder;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomResourceServiceTest {

    @Mock
    private CustomResourceDefinitionService customResourceDefinitionService;

    @Mock
    private CustomResourceService service;

    private CustomResourceDefinition createdCrd;
    private String crdName = "test-crd";
    private String crdGroup = "example.com";
    private String namespace = "default";

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Create a Custom Resource based on the CRD
        GenericKubernetesResource resource = new GenericKubernetesResource();
        resource.setApiVersion(crdGroup + "/v1");
        resource.setKind("Test");

        ObjectMeta metadata = new ObjectMeta();
        metadata.setName(crdName);
        resource.setMetadata(metadata);

        IdAwareCustomResource idAwareCustomResource = new IdAwareCustomResource(resource);
        doAnswer(invocation -> null).when(service).add(anyString(), any(IdAwareCustomResource.class), anyString());

        service.add("tests.example.com", idAwareCustomResource, namespace);

        createdCrd = new CustomResourceDefinitionBuilder()
                .withNewMetadata()
                .withName(crdName)
                .endMetadata()
                .withNewSpec()
                .withGroup(crdGroup)
                .addNewVersion()
                .withName("v1")
                .withServed(true)
                .withStorage(true)
                .endVersion()
                .withScope("Namespaced")
                .withNewNames()
                .withPlural("tests")
                .withSingular("test")
                .withKind("Test")
                .endNames()
                .endSpec()
                .build();

        // Mocking methods of customResourceDefinitionService
        lenient().when(customResourceDefinitionService.fetchStoredVersionName(anyString())).thenReturn("v1");
        lenient().when(customResourceDefinitionService.fetchStoredVersionName(any(CustomResourceDefinition.class))).thenReturn("v1");
        lenient().when(customResourceDefinitionService.getCrdSchema(anyString(), anyString())).thenReturn(new HashMap<>());
        lenient().when(customResourceDefinitionService.crdExists(anyString(), anyString())).thenReturn(true);
        lenient().when(customResourceDefinitionService.findAll(anyCollection(), anyBoolean(), any(Pageable.class))).thenReturn(Page.empty());

        // Mocking service methods
        lenient().when(service.findById(anyString(), anyString(), anyString())).thenReturn(idAwareCustomResource);
        doNothing().when(service).delete(anyString(), anyString(), anyString());
    }

    @AfterEach
    public void cleanup() {
        service.delete("tests.example.com", "test-crd", "default");
    }

    @Test
    public void fetchStoredVersionName() {
        String versionName = customResourceDefinitionService.fetchStoredVersionName("tests.example.com");
        Assertions.assertNotNull(versionName);
    }

    @Test
    public void fetchStoredVersionNameCustomResource() {
        String versionName = customResourceDefinitionService.fetchStoredVersionName(createdCrd);
        Assertions.assertNotNull(versionName);
    }

    @Test
    public void getCrdSchema() {
        Map<String, Serializable> crdSchema = customResourceDefinitionService.getCrdSchema("tests.example.com", "v1");
        Assertions.assertNotNull(crdSchema);
    }

    @Test
    public void crdExists() {
        Assertions.assertTrue(customResourceDefinitionService.crdExists("tests.example.com", "v1"));
    }

    @Test
    public void findAll() {
        Collection<String> ids = new ArrayList<>();
        ids.add("tests.example.com");
        boolean onlyWithoutSchema = true;
        Pageable pageable = PageRequest.ofSize(1);

        Assertions.assertNotNull(customResourceDefinitionService.findAll(ids, onlyWithoutSchema, pageable));
    }

    @Test
    public void findById() {
        Assertions.assertNotNull(service.findById("tests.example.com", "test-crd", "default"));
    }
}
