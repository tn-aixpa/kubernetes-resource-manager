package it.smartcommunitylab.dhub.rm.service;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.GenericKubernetesResourceList;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.NonNamespaceOperation;
import io.fabric8.kubernetes.client.dsl.Resource;
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

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CustomResourceServiceTest {

    @Mock
    KubernetesClient client;

    @Mock
    CustomResourceDefinitionService crdService;

    @Mock
    CustomResourceSchemaService schemaService;

    @Mock
    AuthorizationService authService;

    @InjectMocks
    CustomResourceService service;

    @BeforeEach
    public void setup() {

    }

    @Test
    public void testFindAll() {
        String crdId = "example.crd";
        String namespace = "exampleNamespace";
        Pageable pageable = PageRequest.of(0, 10);

        when(authService.isCrdAllowed(crdId)).thenReturn(true);

        String storedVersion = "v1";
        when(crdService.fetchStoredVersionName(crdId)).thenReturn(storedVersion);

        CustomResourceSchema mockSchema = mock(CustomResourceSchema.class);
        when(schemaService.findCRDByCrdIdAndVersion(crdId, storedVersion)).thenReturn(mockSchema);

        MixedOperation<GenericKubernetesResource, GenericKubernetesResourceList, Resource<GenericKubernetesResource>> mixedOperation = mock(MixedOperation.class);
        GenericKubernetesResourceList resourceList = mock(GenericKubernetesResourceList.class);

        GenericKubernetesResource resource1 = new GenericKubernetesResource();
        ObjectMeta metadata1 = new ObjectMeta();
        metadata1.setName("resource1");
        resource1.setMetadata(metadata1);

        GenericKubernetesResource resource2 = new GenericKubernetesResource();
        ObjectMeta metadata2 = new ObjectMeta();
        metadata2.setName("resource2");
        resource2.setMetadata(metadata2);

        List<GenericKubernetesResource> mockResources = List.of(resource1, resource2);

        when(client.genericKubernetesResources(any())).thenReturn(mixedOperation);
        when(mixedOperation.inNamespace(namespace)).thenReturn(mixedOperation);
        when(mixedOperation.list()).thenReturn(resourceList);
        when(resourceList.getItems()).thenReturn(mockResources);

        Page<IdAwareCustomResource> result = service.findAll(crdId, namespace, null, pageable);

        assertEquals(2, result.getTotalElements()); // Verify the total number of items returned
        assertEquals(2, result.getContent().size()); // Verify the content size

        verify(authService).isCrdAllowed(crdId);
        verify(crdService).fetchStoredVersionName(crdId);
        verify(schemaService).findCRDByCrdIdAndVersion(crdId, storedVersion);
        verify(client).genericKubernetesResources(any());
        verify(mixedOperation).inNamespace(namespace);
        verify(mixedOperation).list();
    }


    //public IdAwareCustomResource findById(String crdId, String id, String namespace)
    @Test
    public void testFindById() {

    }

    //public IdAwareCustomResource add(String crdId, IdAwareCustomResource request, String namespace)
    @Test
    public void testAdd(){

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
