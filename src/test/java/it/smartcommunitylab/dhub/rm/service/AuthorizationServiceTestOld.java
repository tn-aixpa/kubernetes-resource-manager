/*
package it.smartcommunitylab.dhub.rm.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "kubernetes.crd.allowed=crd1,crd2",
        "kubernetes.crd.denied=crd3,crd4",
        "kubernetes.selector.service=serviceSelector",
        "kubernetes.selector.deployment=deploymentSelector",
        "kubernetes.selector.job=jobSelector",
        "kubernetes.selector.pvc=pvcSelector"
})
public class AuthorizationServiceTest {

    @Autowired
    private AuthorizationService authorizationService;


    @Test
    public void test() {

        assertTrue(authorizationService.isCrdAllowed("crd1"));
        assertFalse(authorizationService.isCrdAllowed("crd3"));
        assertFalse(authorizationService.isCrdAllowed("crd5"));

        assertEquals("serviceSelector", authorizationService.getServiceSelector());

        assertEquals("deploymentSelector", authorizationService.getDeploymentSelector());

        assertEquals("jobSelector", authorizationService.getJobSelector());

        assertEquals("pvcSelector", authorizationService.getPVCSelector());
    }
}
*/
