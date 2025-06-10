// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * K8S Resource access authorization service. Defines properties and methods to control the access to K8S resources
 */
@Service
public class K8SAuthorizationService {

    @Value("${kubernetes.crd.allowed}")
    private List<String> allowedCrds;

    @Value("${kubernetes.crd.denied}")
    private List<String> deniedCrds;

    @Value("${kubernetes.selector.service}")
    private String serviceSelector;
    @Value("${kubernetes.selector.deployment}")
    private String deploymentSelector;
    @Value("${kubernetes.selector.job}")
    private String jobSelector;
    @Value("${kubernetes.selector.pvc}")
    private String pvcSelector;
    @Value("${kubernetes.selector.quota}")
    private String quotaSelector;

    public boolean isCrdAllowed(String crdId) {
        return allowedCrds.contains(crdId) || (allowedCrds.isEmpty() && !deniedCrds.contains(crdId));
    }

    public String getServiceSelector() {
        return serviceSelector;
    }

    public String getDeploymentSelector() {
        return deploymentSelector;
    }

    public String getJobSelector() {
        return jobSelector;
    }

    public String getPVCSelector() {
        return pvcSelector;
    }

    public String getQuotaSelector() {
        return quotaSelector;
    }

}
