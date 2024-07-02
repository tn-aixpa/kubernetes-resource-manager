package it.smartcommunitylab.dhub.rm.service;

import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.AppsAPIGroupDSL;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.RollableScalableResource;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentList;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class K8SDeploymentServiceTest {

    @Mock
    private KubernetesClient mockKubernetesClient;

    @Mock
    private AuthorizationService service;

    @Mock
    private AppsAPIGroupDSL mockAppsAPIGroupDSL;

    @Mock
    private MixedOperation<Deployment, DeploymentList, RollableScalableResource<Deployment>> mockDeploymentOperation;

    @Mock
    private RollableScalableResource<Deployment> mockRollableScalableResource;

    @InjectMocks
    private K8SDeploymentService k8sDeploymentService;

    private final String namespace = "test-namespace";
    private final String deploymentName = "test-deployment";
    private final String expectedLog = "Log line 1\nLog line 2";

    @BeforeEach
    public void setup() {
        k8sDeploymentService = new K8SDeploymentService(mockKubernetesClient, service);
        MockitoAnnotations.openMocks(this);
        when(mockAppsAPIGroupDSL.deployments()).thenReturn(mockDeploymentOperation);
    }

    @Test
    public void testGetLog() {
        when(mockDeploymentOperation.inNamespace(namespace)).thenReturn(mockDeploymentOperation);
        when(mockDeploymentOperation.withName(deploymentName)).thenReturn(mockRollableScalableResource);
        when(mockRollableScalableResource.getLog()).thenReturn(expectedLog);

        lenient().when(k8sDeploymentService.getKubernetesClient().apps()).thenReturn(mockAppsAPIGroupDSL);

        List<String> result = k8sDeploymentService.getLog(namespace, deploymentName);

        Assertions.assertEquals(Arrays.asList("Log line 1", "Log line 2"), result);

    }

}


