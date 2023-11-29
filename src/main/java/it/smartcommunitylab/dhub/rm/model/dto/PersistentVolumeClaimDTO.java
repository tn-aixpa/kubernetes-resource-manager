package it.smartcommunitylab.dhub.rm.model.dto;

import java.util.List;

public class PersistentVolumeClaimDTO {

    public enum PVC_VOLUME_MODE {Filesystem, Block};

    public enum PVC_ACCESS_MODE {ReadWriteOnce, ReadOnlyMany, ReadWriteMany, ReadWriteOncePod};

    private String name;
    private List<PVC_ACCESS_MODE> accessModes; 
    private Integer resourceAmount;
    private String storageClassName;
    private PVC_VOLUME_MODE volumeMode;
    private String volumeName;
    

    public List<PVC_ACCESS_MODE> getAccessModes() {
        return accessModes;
    }
    public void setAccessModes(List<PVC_ACCESS_MODE> accessModes) {
        this.accessModes = accessModes;
    }
    public Integer getResourceAmount() {
        return resourceAmount;
    }
    public void setResourceAmount(Integer resourceAmount) {
        this.resourceAmount = resourceAmount;
    }
    public String getStorageClassName() {
        return storageClassName;
    }
    public void setStorageClassName(String storageClassName) {
        this.storageClassName = storageClassName;
    }
    public PVC_VOLUME_MODE getVolumeMode() {
        return volumeMode;
    }
    public void setVolumeMode(PVC_VOLUME_MODE volumeMode) {
        this.volumeMode = volumeMode;
    }
    public String getVolumeName() {
        return volumeName;
    }
    public void setVolumeName(String volumeName) {
        this.volumeName = volumeName;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    
    
}
