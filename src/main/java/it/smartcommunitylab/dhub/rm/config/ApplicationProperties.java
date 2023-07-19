package it.smartcommunitylab.dhub.rm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = true)
public class ApplicationProperties {

    private String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String applicationUrl) {
        this.url = applicationUrl;
    }
}
