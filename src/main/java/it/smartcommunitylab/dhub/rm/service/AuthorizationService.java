package it.smartcommunitylab.dhub.rm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {
    @Value("${kubernetes.crd.allowed}")
    private List<String> allowedCrds;
    @Value("${kubernetes.crd.denied}")
    private List<String> deniedCrds;

    public boolean isCrdAllowed(String crdId) {
        return allowedCrds.contains(crdId) || (allowedCrds.isEmpty() && !deniedCrds.contains(crdId));
    }
}
