package it.smartcommunitylab.dhub.rm.service;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.GenericKubernetesResourceList;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.Resource;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResource;
import org.jetbrains.annotations.NotNull;
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
    KubernetesClient client;

    @Mock
    CustomResourceDefinitionService crdService;

    @Mock
    CustomResourceSchemaService schemaService;

    @Mock
    AuthorizationService authService;

    @InjectMocks
    CustomResourceService service;

    private final String crdId = "example.crd";
    private final String namespace = "exampleNamespace";
    private final String storedVersion = "v1";

    @BeforeEach
    public void setup() {



    }

    private static @NotNull List<GenericKubernetesResource> getGenericKubernetesResources() {
        GenericKubernetesResource resource1 = new GenericKubernetesResource();
        ObjectMeta metadata1 = new ObjectMeta();
        metadata1.setName("resource1");
        resource1.setMetadata(metadata1);

        GenericKubernetesResource resource2 = new GenericKubernetesResource();
        ObjectMeta metadata2 = new ObjectMeta();
        metadata2.setName("resource2");
        resource2.setMetadata(metadata2);

        return List.of(resource1, resource2);
    }

    @Test
    public void testFindAll() {
        Pageable pageable = PageRequest.of(0, 10);

        when(authService.isCrdAllowed(crdId)).thenReturn(true);

        when(crdService.fetchStoredVersionName(crdId)).thenReturn(storedVersion);

        CustomResourceSchema mockSchema = mock(CustomResourceSchema.class);
        when(schemaService.findCRDByCrdIdAndVersion(crdId, storedVersion)).thenReturn(mockSchema);

        MixedOperation<GenericKubernetesResource, GenericKubernetesResourceList, Resource<GenericKubernetesResource>> mixedOperation = mock(MixedOperation.class);
        GenericKubernetesResourceList resourceList = mock(GenericKubernetesResourceList.class);

        List<GenericKubernetesResource> mockResources = getGenericKubernetesResources();

        when(client.genericKubernetesResources(any())).thenReturn(mixedOperation);
        when(mixedOperation.inNamespace(namespace)).thenReturn(mixedOperation);
        when(mixedOperation.list()).thenReturn(resourceList);
        when(resourceList.getItems()).thenReturn(mockResources);

        Page<IdAwareCustomResource> result = service.findAll(crdId, namespace, null, pageable);

        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

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
        //DA FINIRE
        lenient().when(authService.isCrdAllowed(crdId)).thenReturn(true);
        lenient().when(crdService.fetchStoredVersionName(crdId)).thenReturn(storedVersion);

        CustomResourceSchema mockSchema = mock(CustomResourceSchema.class);
        lenient().when(schemaService.findCRDByCrdIdAndVersion(crdId, storedVersion)).thenReturn(mockSchema);

       /*
        NamespaceableResource<GenericKubernetesResource> cr = fetchCustomResource(context, id, namespace);*/

        /*verify(authService).isCrdAllowed(crdId);
        verify(crdService).fetchStoredVersionName(crdId);
        verify(schemaService).findCRDByCrdIdAndVersion(crdId, storedVersion);*/

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
