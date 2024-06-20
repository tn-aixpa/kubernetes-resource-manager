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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;


@SpringBootTest
public class CustomResourceDefinitionServiceTest {

    @Autowired
    private CustomResourceDefinitionService customResourceDefinitionService;

    @Autowired
    private CustomResourceService service;

    private CustomResourceDefinition createdCrd;
    private String crdName = "test-crd";
    private String crdGroup = "example.com";
    private String namespace = "default";

    @BeforeEach
    public void setup() {

        // Create a Custom Resource based on the CRD
        GenericKubernetesResource resource = new GenericKubernetesResource();
        resource.setApiVersion(crdGroup + "/v1");
        resource.setKind("Test");

        ObjectMeta metadata = new ObjectMeta();
        metadata.setName(crdName);
        resource.setMetadata(metadata);

        IdAwareCustomResource idAwareCustomResource = new IdAwareCustomResource(resource);
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

    }

    @AfterEach
    public void cleanup() {
        // Delete the resource
        try {
            service.delete("tests.example.com", "test-crd", "default");

        } catch (Exception e) {
            System.err.println("Failed to delete CRD: " + e.getMessage());
        }
    }

    //String fetchStoredVersionName(String crdId)
    @Test
    public void fetchStoredVersionName() {

        String versionName = customResourceDefinitionService.fetchStoredVersionName("tests.example.com");
        Assertions.assertNotNull(versionName);

    }

    //String fetchStoredVersionName(CustomResourceDefinition crd)
    @Test
    public void fetchStoredVersionNameCustomResource() {

        String versionName = customResourceDefinitionService.fetchStoredVersionName(createdCrd);
        Assertions.assertNotNull(versionName);

    }

    //Map<String, Serializable> getCrdSchema(String crdId, String versionName)
    @Test
    public void getCrdSchema() {

        Map<String, Serializable> crdSchema = customResourceDefinitionService.getCrdSchema("tests.example.com", "v1");
        Assertions.assertNotNull(crdSchema);


    }

    //Map<String, Serializable> getCrdSchema(CustomResourceDefinition crd)
  /*  @Test
    public void getCrdSchemaCustomResource() {

       Map<String, Serializable> crdSchema = customResourceDefinitionService.getCrdSchema(createdCrd);
        Assertions.assertNotNull(crdSchema);

    }*/

    //boolean crdExists(String crdId, String version)
    @Test
    public void crdExists() {
        Assertions.assertTrue(customResourceDefinitionService.crdExists("tests.example.com", "v1"));
    }

    //Page<IdAwareCustomResourceDefinition> findAll
    @Test
    public void findAll() {

        Collection<String> ids = new ArrayList<>();
        ids.add("tests.example.com");
        boolean onlyWithoutSchema = true;
        Pageable pageable = PageRequest.ofSize(1);

        Assertions.assertNotNull(customResourceDefinitionService.findAll(ids, onlyWithoutSchema, pageable));

    }

    //IdAwareCustomResourceDefinition findById(String id)
    @Test
    public void findById() {
        Assertions.assertNotNull(service.findById("tests.example.com", "test-crd", "default"));

    }




}
