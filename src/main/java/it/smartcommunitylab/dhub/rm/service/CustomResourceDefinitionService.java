package it.smartcommunitylab.dhub.rm.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinitionList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import it.smartcommunitylab.dhub.rm.model.CustomResourceDefinitionPOJO;

@Service
public class CustomResourceDefinitionService {
    private final KubernetesClient client = new KubernetesClientBuilder().build();

    public List<CustomResourceDefinitionPOJO> findAll() {
        CustomResourceDefinitionList crdList = client.apiextensions().v1().customResourceDefinitions().list();

        return crdList.getItems()
                .stream()
                .map(crd -> new CustomResourceDefinitionPOJO(crd))
                .collect(Collectors.toList());
    }

    public CustomResourceDefinitionPOJO findById(String id) {
        CustomResourceDefinition crd = client.apiextensions().v1().customResourceDefinitions().withName(id).get();

        if(crd == null) {
            throw new NoSuchElementException("No CRD with this ID");
        }
        return new CustomResourceDefinitionPOJO(crd);
    }
}
