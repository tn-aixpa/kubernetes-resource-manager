package it.smartcommunitylab.dhub.rm.model.dto;

import java.util.Map;

public class SecretDTO {
    
    private String name;
    private Map<String, String> data;
    
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Map<String, String> getData() {
        return data;
    }
    public void setData(Map<String, String> data) {
        this.data = data;
    }

    
}
