package it.smartcommunitylab.dhub.rm.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.MapType;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionList;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionVersion;
import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.exception.ParsingException;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;
import java.io.IOException;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class CustomResourceDefinitionService {

    private final KubernetesClient client;
    private final AuthorizationService authService;

    public CustomResourceDefinitionService(KubernetesClient client, AuthorizationService authService) {
        this.client = client;
        this.authService = authService;
    }

    private CustomResourceDefinitionVersion fetchVersion(String crdId, String versionName) {
        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(crdId).get();
        if (crd == null) {
            throw new NoSuchElementException("No CRD with this ID");
        }

        Optional<CustomResourceDefinitionVersion> storedVersion = crd
            .getSpec()
            .getVersions()
            .stream()
            .filter(version -> version.getName().equals(versionName))
            .findAny();

        if (!storedVersion.isPresent()) {
            throw new NoSuchElementException("No version stored for this CRD");
        }

        return storedVersion.get();
    }

    public String fetchStoredVersionName(String crdId) {
        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(crdId).get();
        if (crd == null) {
            throw new NoSuchElementException("No CRD with this ID");
        }

        Optional<CustomResourceDefinitionVersion> storedVersion = crd
            .getSpec()
            .getVersions()
            .stream()
            .filter(version -> version.getStorage())
            .findAny();

        if (!storedVersion.isPresent()) {
            throw new NoSuchElementException("No version stored for this CRD");
        }

        return storedVersion.get().getName();
    }

    public Map<String, Serializable> getCrdSchema(String crdId, String versionName) {
        CustomResourceDefinitionVersion version = fetchVersion(crdId, versionName);
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

        if (json != null) {
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

        if (crd == null) {
            return false;
        }

        Optional<CustomResourceDefinitionVersion> kubeVersion = crd
            .getSpec()
            .getVersions()
            .stream()
            .filter(v -> v.getName().equals(version))
            .findAny();

        return kubeVersion.isPresent();
    }

    public Page<IdAwareCustomResourceDefinition> findAll(Pageable pageable) {
        CustomResourceDefinitionList crdList = client.apiextensions().v1().customResourceDefinitions().list();
        List<IdAwareCustomResourceDefinition> crds = crdList
            .getItems()
            .stream()
            .filter(crd -> authService.isCrdAllowed(crd.getMetadata().getName()))
            .map(crd -> new IdAwareCustomResourceDefinition(crd))
            .collect(Collectors.toList());

        //sort by CRD ID and provide pagination
        crds.sort((IdAwareCustomResourceDefinition h1, IdAwareCustomResourceDefinition h2) ->
            h1.getId().compareTo(h2.getId())
        );
        int offset = (int) pageable.getOffset();
        int pageSize = Math.min(pageable.getPageSize(), crds.size());
        int toIndex = Math.min(offset + pageSize, crds.size());

        return new PageImpl<>(crds.subList(offset, toIndex), pageable, crds.size());
    }

    public IdAwareCustomResourceDefinition findById(String id) {
        if (!authService.isCrdAllowed(id)) {
            throw new AccessDeniedException("Access to this CRD is not allowed");
        }

        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(id).get();

        if (crd == null) {
            throw new NoSuchElementException("No CRD with this ID");
        }
        return new IdAwareCustomResourceDefinition(crd);
    }
}
