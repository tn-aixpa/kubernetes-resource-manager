package it.smartcommunitylab.dhub.rm.service;

import java.util.Arrays;

import io.fabric8.kubernetes.api.model.batch.v1.Job;
import io.fabric8.kubernetes.api.model.batch.v1.JobList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.BatchAPIGroupDSL;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.ScalableResource;
import io.fabric8.kubernetes.client.dsl.V1BatchAPIGroupDSL;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class K8SJobServiceTest {

    @Mock
    KubernetesClient client;

    @Mock
    AuthorizationService service;

    @Mock
    BatchAPIGroupDSL batchAPIGroupDSL;

    @Mock
    V1BatchAPIGroupDSL v1BatchAPIGroupDSL;

    @Mock
    MixedOperation<Job, JobList, ScalableResource<Job>> mixedOperation;

    @Mock
    ScalableResource<Job> scalableResource;

    @InjectMocks
    K8SJobService k8sJobService;

    private final String namespace = "test-namespace";
    private final String deploymentName = "test-deployment";
    private final String expectedLog = "Log line 1\nLog line 2";

    @BeforeEach
    public void setup() {
        k8sJobService = new K8SJobService(client, service);
        MockitoAnnotations.openMocks(this);
        when(v1BatchAPIGroupDSL.jobs()).thenReturn(mixedOperation);
    }

    @Test
    public void testGetLog() {

        Mockito.when(mixedOperation.inNamespace(namespace)).thenReturn(mixedOperation);
        Mockito.when(mixedOperation.withName(deploymentName)).thenReturn(scalableResource);
        Mockito.when(scalableResource.getLog()).thenReturn(expectedLog);

        Mockito.when(k8sJobService.getKubernetesClient().batch()).thenReturn(batchAPIGroupDSL);
        Mockito.when(batchAPIGroupDSL.v1()).thenReturn(v1BatchAPIGroupDSL);

        List<String> result = k8sJobService.getLog(namespace, deploymentName);

        Assertions.assertEquals(Arrays.asList("Log line 1", "Log line 2"), result);

        /*
         when(mockDeploymentOperation.inNamespace(namespace)).thenReturn(mockDeploymentOperation);
        when(mockDeploymentOperation.withName(deploymentName)).thenReturn(mockRollableScalableResource);
        when(mockRollableScalableResource.getLog()).thenReturn(expectedLog);

        lenient().when(k8sDeploymentService.getKubernetesClient().apps()).thenReturn(mockAppsAPIGroupDSL);

        List<String> result = k8sDeploymentService.getLog(namespace, deploymentName);

        Assertions.assertEquals(Arrays.asList("Log line 1", "Log line 2"), result);
         */

    }

}