package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionList;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionVersion;
import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;

@Service
public class CustomResourceDefinitionService {
    private final KubernetesClient client;

    public CustomResourceDefinitionService(KubernetesClient client) {
        this.client = client;
    }

    public String fetchStoredVersion(String crdId) {
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

        return storedVersion.get().getName();
    }

    public List<IdAwareCustomResourceDefinition> findAll() {
        CustomResourceDefinitionList crdList = client.apiextensions().v1().customResourceDefinitions().list();

        return crdList.getItems()
                .stream()
                .map(crd -> new IdAwareCustomResourceDefinition(crd))
                .collect(Collectors.toList());
    }

    public IdAwareCustomResourceDefinition findById(String id) {
        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(id).get();

        if(crd == null) {
            throw new NoSuchElementException("No CRD with this ID");
        }
        return new IdAwareCustomResourceDefinition(crd);
    }
}
