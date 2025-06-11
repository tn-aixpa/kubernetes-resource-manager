// SPDX-License-Identifier: Apache-2.0
package it.smartcommunitylab.dhub.rm.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import it.smartcommunitylab.dhub.rm.service.AccessControlService;
import it.smartcommunitylab.dhub.rm.service.AccessControlService.RESOURCE_OP;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * API to get the user permissions.
 * 
 * <p>
 * This API provides methods to get the user permissions.
 * </p>
 */
@RestController
@PreAuthorize("hasAuthority('ROLE_USER')")
@SecurityRequirement(name = "basicAuth")
@SecurityRequirement(name = "jwtAuth")
@RequestMapping(SystemKeys.API_PATH + "/user")
@Validated
public class UserApi {

    /**
     * The access control service.
     */
    @Autowired
    private AccessControlService service;

    /**
     * Get the user permissions.
     * 
     * @return the user permissions.
     */
    @GetMapping
    public Map<String, Set<RESOURCE_OP>> getPermissions() {
        Map<String, Set<RESOURCE_OP>> userPermissions = service.getUserPermissions();
        return userPermissions;
    }
}
