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
import org.springframework.util.StringUtils;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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

        when(client.secrets()).thenReturn(secretOperation);
        when(secretOperation.inNamespace(namespace)).thenReturn(secretOperation);
    }

    @Test
    public void testGetItems() {
        when(secretOperation.list()).thenReturn(secretList);
        List<Secret> items = k8sSecretService.getItems(namespace);
        Assertions.assertEquals(1, items.size());
        Assertions.assertEquals("*************", items.get(0).getData().get(key));
    }

    @Test
    public void testDecode() {
        when(secretOperation.list()).thenReturn(secretList);
        String decodedValue = k8sSecretService.decode(namespace, secretId, key);
        Assertions.assertEquals("admin", decodedValue);
    }

    @Test
    public void testDecodeSecretNotFound() {
        when(secretOperation.list()).thenReturn(new SecretList());
        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            k8sSecretService.decode(namespace, secretId, key);
        });
    }

    @Test
    public void testDecodeKeyNotFound() {
        when(secretOperation.list()).thenReturn(secretList);
        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            k8sSecretService.decode(namespace, secretId, "invalidKey");
        });
    }

    @Test
    public void testAdd() {
        when(secretOperation.resource(any(Secret.class))).thenReturn(secretResource);
        when(secretResource.create()).thenReturn(secret);
        when(secretOperation.list()).thenReturn(secretList);

        IdAwareResource<Secret> result = k8sSecretService.add(namespace, secretDTO);

        Assertions.assertEquals(secretId, result.getId());
        Assertions.assertEquals(secret, result.getResource());
    }

    @Test
    public void testAddWithData() {
        Map<String, String> data = new HashMap<>();
        data.put(key, "testData");
        secretDTO.setData(data);

        when(secretOperation.resource(any(Secret.class))).thenReturn(secretResource);
        when(secretResource.create()).thenReturn(secret);
        when(secretOperation.list()).thenReturn(secretList);

        IdAwareResource<Secret> result = k8sSecretService.add(namespace, secretDTO);

        Assertions.assertEquals(secretId, result.getId());
        Assertions.assertNotNull(result.getResource().getData().get(key));
    }

    @Test
    public void testDelete() {
        lenient().when(resourceOperation.item()).thenReturn(null);
        lenient().when(resourceOperation.serverSideApply()).thenReturn(null);
        lenient().when(secretOperation.withName(anyString())).thenReturn(resourceOperation);

        K8SSecretService spyService = spy(k8sSecretService);
        doReturn(resourceCache).when(spyService).getResourceCache();

        spyService.delete(namespace, secretId);

        verify(resourceCache, times(1)).invalidate(namespace);
        verify(resourceOperation, times(1)).delete();
    }
}
