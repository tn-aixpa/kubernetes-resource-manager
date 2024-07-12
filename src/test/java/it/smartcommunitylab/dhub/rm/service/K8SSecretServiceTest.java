package it.smartcommunitylab.dhub.rm.service;

import com.google.common.cache.LoadingCache;
import io.fabric8.kubernetes.api.model.Secret;
import io.fabric8.kubernetes.api.model.SecretBuilder;
import io.fabric8.kubernetes.api.model.SecretList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.Resource;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.model.dto.SecretDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class K8SSecretServiceTest {

    @Mock
    KubernetesClient client;

    @Mock
    AuthorizationService authService;

    @Mock
    MixedOperation<Secret, SecretList, Resource<Secret>> secretOperation;

    @Mock
    SecretDTO secretDTO;

    @Mock
    Resource<Secret> secretResource;

    @Mock
    LoadingCache<String, Map<String, IdAwareResource<Secret>>> resourceCache;

    @Mock
    Resource<Secret> resourceOperation;

    @InjectMocks
    K8SSecretService k8sSecretService;

    String namespace = "test";
    String key = "username";
    String secretId = "my-secret-id";
    String encodedValue = Base64.getEncoder().encodeToString("admin".getBytes());

    Secret secret;
    SecretList secretList;

    @BeforeEach
    public void setup() {
        secret = new SecretBuilder()
                .withNewMetadata().withName(secretId).withNamespace(namespace).endMetadata()
                .addToData(key, encodedValue)
                .build();

        secretDTO = new SecretDTO();
        secretDTO.setName(secretId);

        secretList = new SecretList();
        secretList.setItems(List.of(secret));

        k8sSecretService = new K8SSecretService(client, authService);
        ReflectionTestUtils.setField(k8sSecretService, "labelFilters", "");
        ReflectionTestUtils.setField(k8sSecretService, "annotationFilters", "");
        ReflectionTestUtils.setField(k8sSecretService, "ownerFilters", "");
        ReflectionTestUtils.setField(k8sSecretService, "nameFilters", secretId);
        k8sSecretService.initFilters();

    }

    @Test
    public void testDecode() {

        Mockito.when(client.secrets()).thenReturn(secretOperation);
        Mockito.when(secretOperation.inNamespace(namespace)).thenReturn(secretOperation);
        Mockito.when(secretOperation.list()).thenReturn(secretList);

        String decodedValue = k8sSecretService.decode(namespace, secretId, key);

        Assertions.assertEquals("admin", decodedValue);
    }

    @Test
    public void testAdd(){

        Mockito.when(client.secrets()).thenReturn(secretOperation);
        Mockito.when(secretOperation.inNamespace(namespace)).thenReturn(secretOperation);
        Mockito.when(secretOperation.resource(Mockito.any(Secret.class))).thenReturn(secretResource);
        Mockito.when(secretOperation.list()).thenReturn(secretList);
        Mockito.when(secretResource.create()).thenReturn(secret);

        IdAwareResource<Secret> result = k8sSecretService.add(namespace, secretDTO);

        Assertions.assertEquals(secretId, result.getId());
        Assertions.assertEquals(secret, result.getResource());

    }

    @Test
    public void testDelete(){
        lenient().when(resourceOperation.item()).thenReturn(null);
        lenient().when(resourceOperation.serverSideApply()).thenReturn(null);
        lenient().when(secretOperation.withName(anyString())).thenReturn(resourceOperation);

        Mockito.when(client.secrets()).thenReturn(secretOperation);
        Mockito.when(secretOperation.inNamespace(namespace)).thenReturn(secretOperation);

        K8SSecretService spyService = spy(k8sSecretService);
        doReturn(resourceCache).when(spyService).getResourceCache();

        spyService.delete(namespace, secretId);

        verify(resourceCache, times(1)).invalidate(namespace);
        verify(resourceOperation, times(1)).delete();

    }

}
