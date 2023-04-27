package it.smartcommunitylab.dhub.rm.service;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.MapType;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionList;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionVersion;
import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.exception.ParsingException;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;

@Service
public class CustomResourceDefinitionService {
    private final KubernetesClient client;
    @Value("${kubernetes.crd.allowed}")
    private List<String> allowedCrds;
    @Value("${kubernetes.crd.denied}")
    private List<String> deniedCrds;

    public CustomResourceDefinitionService(KubernetesClient client) {
        this.client = client;
    }

    public boolean isCrdAllowed(String crdId) {
        return allowedCrds.contains(crdId) || (allowedCrds.isEmpty() && !deniedCrds.contains(crdId));
    }

    private CustomResourceDefinitionVersion fetchStoredVersion(String crdId) {
        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(crdId).get();
        if(crd == null) {
            throw new NoSuchElementException("No CRD with this ID");
        }

        Optional<CustomResourceDefinitionVersion> storedVersion = crd.getSpec().getVersions()
                .stream()
                .filter(version -> version.getStorage())
                .findAny();

        if(!storedVersion.isPresent()) {
            throw new NoSuchElementException("No version stored for this CRD");
        }

        return storedVersion.get();
    }

    public String fetchStoredVersionName(String crdId) {
        return fetchStoredVersion(crdId).getName();
    }

    public Map<String, Serializable> getCrdSchema(String crdId) {
        CustomResourceDefinitionVersion version = fetchStoredVersion(crdId);
        Map<String, Serializable> map = null;

        //convert stored CRD schema to map
        ObjectMapper objectMapper = new ObjectMapper();
        MapType typeRef = objectMapper.getTypeFactory().constructMapType(Map.class, String.class, Serializable.class);
        String json = null;

        try {
            json = objectMapper.writeValueAsString(version.getSchema().getOpenAPIV3Schema());
        } catch (final JsonProcessingException e) {
            throw new ParsingException("CRD schema parsing failed: " + e.getMessage());
        }

        if(json != null) {
            try {
                map = objectMapper.readValue(json, typeRef);
            } catch (final IOException e) {
                throw new ParsingException("CRD schema parsing failed: " + e.getMessage());
            }
        }
        return map;
    }

    public boolean crdExists(String crdId, String version) {
        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(crdId).get();

        if(crd == null) {
            return false;
        }

        Optional<CustomResourceDefinitionVersion> kubeVersion = crd.getSpec().getVersions()
                .stream()
                .filter(v -> v.getName().equals(version))
                .findAny();

        return kubeVersion.isPresent();
    }

    public List<IdAwareCustomResourceDefinition> findAll() {
        CustomResourceDefinitionList crdList = client.apiextensions().v1().customResourceDefinitions().list();

        return crdList.getItems()
                .stream()
                .filter(crd -> isCrdAllowed(crd.getMetadata().getName()))
                .map(crd -> new IdAwareCustomResourceDefinition(crd))
                .collect(Collectors.toList());
    }

    public IdAwareCustomResourceDefinition findById(String id) {
        if(!isCrdAllowed(id)) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(id).get();

        if(crd == null) {
            throw new NoSuchElementException("No CRD with this ID");
        }
        return new IdAwareCustomResourceDefinition(crd);
    }
}
