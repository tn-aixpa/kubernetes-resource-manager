package it.smartcommunitylab.dhub.rm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auth-config")
public class AuthenticationProperties {
    String basicUsername;
    String basicPassword;
    String prefix;
    String role;
    String jwtRoleClaim;

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
    public String getPrefix() {
        return prefix;
    }
    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getJwtRoleClaim() {
        return jwtRoleClaim;
    }
    public void setJwtRoleClaim(String jwtRoleClaim) {
        this.jwtRoleClaim = jwtRoleClaim;
    }
}
