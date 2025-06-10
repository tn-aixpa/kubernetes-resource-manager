// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = true)
public class ApplicationProperties {

    private String url;
    private String coreName;

    public String getUrl() {
        return url;
    }

    public void setUrl(String applicationUrl) {
        this.url = applicationUrl;
    }

    public String getCoreName() {
        return coreName;
    }

    public void setCoreName(String coreName) {
        this.coreName = coreName;
    }
}
