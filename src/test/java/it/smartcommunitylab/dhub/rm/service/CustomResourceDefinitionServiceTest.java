package it.smartcommunitylab.dhub.rm.service;

import io.fabric8.kubernetes.api.model.apiextensions.v1.*;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.ApiextensionsAPIGroupDSL;
import io.fabric8.kubernetes.client.V1ApiextensionAPIGroupDSL;
import io.fabric8.kubernetes.client.dsl.NonNamespaceOperation;
import io.fabric8.kubernetes.client.dsl.Resource;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomResourceDefinitionServiceTest {

    @Mock
    private KubernetesClient client;

    @Mock
    private AuthorizationService authService;

    @Mock
    private CustomResourceSchemaRepository customResourceSchemaRepository;

    @InjectMocks
    private CustomResourceDefinitionService customResourceDefinitionService;

    private CustomResourceDefinition createdCrd;
    private final String crdName = "test-crd";
    private final String crdGroup = "example.com";

    @BeforeEach
    public void setup() {
        // Create a Custom Resource Definition with schema
        CustomResourceValidation validation = new CustomResourceValidation();
        validation.setOpenAPIV3Schema(new JSONSchemaProps());

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
                .withSchema(validation) // Add schema to version
                .endVersion()
                .withScope("Namespaced")
                .withNewNames()
                .withPlural("tests")
                .withSingular("test")
                .withKind("Test")
                .endNames()
                .endSpec()
                .build();

        // Mocking KubernetesClient response
        ApiextensionsAPIGroupDSL apiextensions = mock(ApiextensionsAPIGroupDSL.class);
        V1ApiextensionAPIGroupDSL v1Apiextensions = mock(V1ApiextensionAPIGroupDSL.class);
        NonNamespaceOperation<CustomResourceDefinition, CustomResourceDefinitionList, Resource<CustomResourceDefinition>> crdOperation = mock(NonNamespaceOperation.class);

        lenient().when(client.apiextensions()).thenReturn(apiextensions);
        lenient().when(apiextensions.v1()).thenReturn(v1Apiextensions);
        lenient().when(v1Apiextensions.customResourceDefinitions()).thenReturn(crdOperation);

        CustomResourceDefinitionList crdList = new CustomResourceDefinitionList();
        crdList.setItems(Collections.singletonList(createdCrd));

        lenient().when(crdOperation.list()).thenReturn(crdList);

        // Mocking AuthorizationService responses
        lenient().when(authService.isCrdAllowed(anyString())).thenReturn(true);

        // Mocking CustomResourceSchemaRepository responses
        lenient().when(customResourceSchemaRepository.findByCrdIdAndVersion(anyString(), anyString()))
                .thenReturn(Optional.empty());
    }

    @Test
    public void testFetchStoredVersionName() {
        String versionName = customResourceDefinitionService.fetchStoredVersionName(crdName);
        assertEquals("v1", versionName);
    }

    @Test
    public void testFetchStoredVersionNameCustomResource() {
        String versionName = customResourceDefinitionService.fetchStoredVersionName(createdCrd);
        assertEquals("v1", versionName);
    }

    @Test
    public void testGetCrdSchema() {
        Map<String, Serializable> crdSchema = customResourceDefinitionService.getCrdSchema(crdName, "v1");
        assertNotNull(crdSchema);
    }

    @Test
    public void testCrdExists() {
        assertTrue(customResourceDefinitionService.crdExists(crdName, "v1"));
    }

    @Test
    public void testFindAll() {
        Collection<String> ids = new ArrayList<>();
        ids.add(crdName);
        boolean onlyWithoutSchema = true;
        Pageable pageable = PageRequest.of(0, 10);

        Page<IdAwareCustomResourceDefinition> result = customResourceDefinitionService.findAll(ids, onlyWithoutSchema, pageable);
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    public void testFindById() {
        IdAwareCustomResourceDefinition result = customResourceDefinitionService.findById(crdName);
        assertNotNull(result);
        assertEquals(crdName, result.getId());
    }
}
