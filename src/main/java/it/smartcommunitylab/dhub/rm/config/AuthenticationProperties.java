package it.smartcommunitylab.dhub.rm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auth-config")
public class AuthenticationProperties {
    //TODO spostare qui anche configurazione per oauth2 e toglierla da spring, rinominare client-id in audience
    //TODO rinominare auth-config in auth
    String basicUsername;
    String basicPassword;

    public String getBasicUsername() {
        return basicUsername;
    }
    public void setBasicUsername(String basicUsername) {
        this.basicUsername = basicUsername;
    }
    public String getBasicPassword() {
        return basicPassword;
    }
    public void setBasicPassword(String basicPassword) {
        this.basicPassword = basicPassword;
    }
}
