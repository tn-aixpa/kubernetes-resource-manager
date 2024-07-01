package it.smartcommunitylab.dhub.rm.service;

import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.AppsAPIGroupDSL;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.RollableScalableResource;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentList;

public class K8SDeploymentServiceTest {

    @Mock
    private KubernetesClient mockKubernetesClient;

    @Mock
    private AppsAPIGroupDSL mockAppsAPIGroupDSL;

    @Mock
    private MixedOperation<Deployment, DeploymentList, RollableScalableResource<Deployment>> mockDeploymentOperation;

    @Mock
    private RollableScalableResource<Deployment> mockRollableScalableResource;

    @InjectMocks
    private K8SDeploymentService k8sDeploymentService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        when(mockKubernetesClient.apps()).thenReturn(mockAppsAPIGroupDSL);
        when(mockAppsAPIGroupDSL.deployments()).thenReturn(mockDeploymentOperation);
    }

    @Test
    public void testGetLog() {
        String namespace = "test-namespace";
        String deploymentName = "test-deployment";
        String expectedLog = "Log line 1\nLog line 2";

        when(mockDeploymentOperation.inNamespace(namespace)).thenReturn(mockDeploymentOperation);
        when(mockDeploymentOperation.withName(deploymentName)).thenReturn(mockRollableScalableResource);
        when(mockRollableScalableResource.getLog()).thenReturn(expectedLog);

        List<String> result = k8sDeploymentService.getLog(namespace, deploymentName);

        Assertions.assertEquals(Arrays.asList("Log line 1", "Log line 2"), result);
    }
}


