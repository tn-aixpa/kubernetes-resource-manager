// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.service;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import io.fabric8.kubernetes.api.model.PersistentVolumeClaim;
import io.fabric8.kubernetes.api.model.PersistentVolumeClaimBuilder;
import io.fabric8.kubernetes.api.model.Quantity;
import io.fabric8.kubernetes.api.model.storage.StorageClass;
import io.fabric8.kubernetes.client.KubernetesClient;
import it.smartcommunitylab.dhub.rm.model.IdAwareResource;
import it.smartcommunitylab.dhub.rm.model.dto.PersistentVolumeClaimDTO;
import it.smartcommunitylab.dhub.rm.model.dto.PersistentVolumeClaimDTO.PVC_VOLUME_MODE;
import jakarta.annotation.PostConstruct;

/**
 * Service for K8S Persistent Volume Claim resource
 */
@Service
public class K8SPVCService extends K8SResourceService<PersistentVolumeClaim> {
    
    private List<IdAwareResource<StorageClass>> storageClasses;

    @Value("${kubernetes.pvc.managed-by}")
    private String managedByLabel;
    @Value("${kubernetes.pvc.storage-classes}")
    private String acceptedStorageClasses;

    public K8SPVCService(KubernetesClient client, K8SAuthorizationService authService) {
        super(client, authService, 60);
    }

    @PostConstruct
    public void init() {
        List<IdAwareResource<StorageClass>> all = getKubernetesClient().storage().v1().storageClasses().list().getItems().stream().map(IdAwareResource::new).toList();
         if (StringUtils.hasText(acceptedStorageClasses)) {
            Set<String> acceptedSet = StringUtils.commaDelimitedListToSet(acceptedStorageClasses);
            storageClasses = all.stream().filter(c -> acceptedSet.contains(c.getResource().getMetadata().getName())).toList();
        } else {
            storageClasses = all; 
        }
    }

    public static final Logger logger = LoggerFactory.getLogger(K8SPVCService.class);

    @Override
    protected List<PersistentVolumeClaim> getItems(String namespace) {
            return java.util.Arrays.asList(getAuthService().getPVCSelector().split("\\|")).stream()
                        .map(s -> getKubernetesClient().persistentVolumeClaims().inNamespace(namespace).withLabelSelector(s).list().getItems())
                        .flatMap(Collection::stream).collect(Collectors.toList());

    }

    /**
     * 
     * @return List of available storage classes
     */
    public List<IdAwareResource<StorageClass>> listStorageClasses() {
        return storageClasses;
    }

    /**
     * Add new PersistentVolumeClaim to the namespace. The name, storage class, volume mode and name, access modes and requested space are defined by the provided DTO object.
     * @param namespace
     * @param dto
     * @return
     */
    public IdAwareResource<PersistentVolumeClaim> add(String namespace, PersistentVolumeClaimDTO dto) {
        PersistentVolumeClaim persistentVolumeClaim = new PersistentVolumeClaimBuilder()
        .withNewMetadata()
            .withName(dto.getName())
            .addToLabels("app.kubernetes.io/managed-by", managedByLabel)
        .endMetadata()
        .withNewSpec()
        .withStorageClassName(dto.getStorageClassName())
        .withVolumeMode(dto.getVolumeMode() != null ? dto.getVolumeMode().name() : PVC_VOLUME_MODE.Filesystem.name())
        .withVolumeName(dto.getVolumeName())
        .withAccessModes(dto.getAccessModes().stream().map(am -> am.name()).toList())
        .withNewResources()
        .addToRequests("storage", new Quantity(dto.getResourceAmount() +"Gi"))
        .endResources()
        .endSpec()
        .build();

        getResourceCache().invalidate(namespace);
        getKubernetesClient().persistentVolumeClaims().inNamespace(namespace).resource(persistentVolumeClaim).item();
        getKubernetesClient().persistentVolumeClaims().inNamespace(namespace).resource(persistentVolumeClaim).serverSideApply();
        return findById(namespace, dto.getName());
    }

    /**
     * Deleted the PersistentVolumeClaim with the specified name and namespace
     * @param namespace
     * @param pvcId
     */
    public void delete(String namespace, String pvcId) {
        getResourceCache().invalidate(namespace);
        getKubernetesClient().persistentVolumeClaims().inNamespace(namespace).withName(pvcId).delete();
    }
}
