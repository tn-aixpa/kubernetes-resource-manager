package it.smartcommunitylab.dhub.rm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@ConfigurationProperties(prefix = "auth")
public class AuthenticationProperties {

    String basicUsername;
    String basicPassword;
    String oauth2IssuerUri;
    String oauth2Audience;

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

    public String getOauth2IssuerUri() {
        return oauth2IssuerUri;
    }

    public void setOauth2IssuerUri(String oauth2IssuerUri) {
        this.oauth2IssuerUri = oauth2IssuerUri;
    }

    public String getOauth2Audience() {
        return oauth2Audience;
    }

    public void setOauth2Audience(String oauth2Audience) {
        this.oauth2Audience = oauth2Audience;
    }

    public boolean isBasicAuthEnabled() {
        return StringUtils.hasText(basicUsername) && StringUtils.hasText(basicPassword);
    }

    public boolean isOAuthEnabled() {
        return StringUtils.hasText(oauth2IssuerUri) && StringUtils.hasText(oauth2Audience);
    }

    public boolean isRequired() {
        return isBasicAuthEnabled() || isOAuthEnabled();
    }
}
