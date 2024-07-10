package it.smartcommunitylab.dhub.rm.service;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.GenericKubernetesResourceList;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.NamespaceableResource;
import io.fabric8.kubernetes.client.dsl.Resource;
import io.fabric8.kubernetes.client.dsl.base.CustomResourceDefinitionContext;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

//WARNING!!!
//Test still not done!
@ExtendWith(MockitoExtension.class)
public class CustomResourceServiceTest {

    @Mock
    private KubernetesClient client;

    @Mock
    private CustomResourceDefinitionService crdService;

    @Mock
    private CustomResourceSchemaService schemaService;

    @Mock
    GenericKubernetesResourceList resourceList;

    @Mock
    CustomResourceSchema mockSchema;

    @Mock
    private CustomResourceDefinitionContext context;

    @Mock
    private GenericKubernetesResource genericKubeResource;

    //

    @Mock
    IdAwareCustomResource idAwareCustomResource;

    //

    @Mock
    private AuthorizationService authService;

    @Mock
    MixedOperation<GenericKubernetesResource, GenericKubernetesResourceList, Resource<GenericKubernetesResource>> mixedOperation;

    @Mock
    NamespaceableResource<GenericKubernetesResource> mockNamespaceableResource;

    @InjectMocks
    private CustomResourceService customResourceService;

    private final String crdId = "example.com";
    private final String id = "resource1";
    private final String namespace = "default";
    private final String storedVersion = "v1";

    @BeforeEach
    void setUp() {
        context = new CustomResourceDefinitionContext.Builder()
                .withScope("Namespaced")
                .withGroup("com")
                .withName("example.com")
                .withPlural("example")
                .withVersion(storedVersion)
                .build();

        lenient().when(authService.isCrdAllowed(crdId)).thenReturn(true);

        genericKubeResource = new GenericKubernetesResource();
        genericKubeResource.setMetadata(new ObjectMeta());
        genericKubeResource.getMetadata().setName(id);
        genericKubeResource.setApiVersion(storedVersion);

        mockSchema = new CustomResourceSchema();
        mockSchema.setCrdId(crdId);
        mockSchema.setVersion(storedVersion);


    }

    @Test
    public void testFindAll() {
        Pageable pageable = PageRequest.of(0, 10);

        when(crdService.fetchStoredVersionName(crdId)).thenReturn(storedVersion);

        when(schemaService.findCRDByCrdIdAndVersion(crdId, storedVersion)).thenReturn(mockSchema);

        List<GenericKubernetesResource> mockResources = List.of(genericKubeResource);

        when(client.genericKubernetesResources(any())).thenReturn(mixedOperation);
        when(mixedOperation.inNamespace(namespace)).thenReturn(mixedOperation);
        when(mixedOperation.list()).thenReturn(resourceList);
        when(resourceList.getItems()).thenReturn(mockResources);

        Page<IdAwareCustomResource> result = customResourceService.findAll(crdId, namespace, null, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());

        verify(authService).isCrdAllowed(crdId);
        verify(crdService).fetchStoredVersionName(crdId);
        verify(schemaService).findCRDByCrdIdAndVersion(crdId, storedVersion);
        verify(client).genericKubernetesResources(any());
        verify(mixedOperation).inNamespace(namespace);
        verify(mixedOperation).list();
    }


    @Test
    public void testFindById() {
        lenient().when(crdService.fetchStoredVersionName(crdId)).thenReturn(storedVersion);

        lenient().when(schemaService.findCRDByCrdIdAndVersion(crdId, storedVersion)).thenReturn(mockSchema);

        List<GenericKubernetesResource> mockResources = List.of(genericKubeResource);

        when(client.genericKubernetesResources(any())).thenReturn(mixedOperation);
        when(mixedOperation.inNamespace(namespace)).thenReturn(mixedOperation);
        when(mixedOperation.list()).thenReturn(resourceList);
        lenient().when(client.genericKubernetesResources(context).inNamespace(namespace).list()).thenReturn(resourceList);
        lenient().when(resourceList.getItems()).thenReturn(mockResources);
        when(client.resource(genericKubeResource)).thenReturn(mockNamespaceableResource);
        when(mockNamespaceableResource.get()).thenReturn(genericKubeResource);

       IdAwareCustomResource result = customResourceService.findById(crdId, id, namespace);

        assertNotNull(result);
        assertEquals(id, result.getId());

    }


    //public IdAwareCustomResource add(String crdId, IdAwareCustomResource request, String namespace)
    @Test
    public void testAdd(){

        when(crdService.fetchStoredVersionName(crdId)).thenReturn(storedVersion);
        when(idAwareCustomResource.getCr()).thenReturn(genericKubeResource);

        IdAwareCustomResource result = customResourceService.add(crdId, idAwareCustomResource, namespace);

        assertNotNull(result);


    }

    //public IdAwareCustomResource update(String crdId, String id, IdAwareCustomResource request, String namespace)
    @Test
    public void testUpdate(){

    }

    //public void delete(String crdId, String id, String namespace)
    @Test
    public void testDelete(){

    }



}
