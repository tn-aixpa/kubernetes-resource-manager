// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

package it.smartcommunitylab.dhub.rm.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "access", ignoreUnknownFields = true)
public class RoleProperties {

    private List<RoleConfig> roles;

    public List<RoleConfig> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleConfig> roles) {
        this.roles = roles;
    }

    public static class RoleConfig {
        private String role;
        private List<String> resources;

        public String getRole() {
            return role;
        }
        public void setRole(String role) {
            this.role = role;
        }
        public List<String> getResources() {
            return resources;
        }
        public void setResources(List<String> resources) {
            this.resources = resources;
        }
    }
}
