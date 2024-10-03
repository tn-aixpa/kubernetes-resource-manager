package it.smartcommunitylab.dhub.rm.service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import it.smartcommunitylab.dhub.rm.config.AuthenticationProperties;
import it.smartcommunitylab.dhub.rm.config.RoleProperties;
import jakarta.annotation.PostConstruct;

/**
 * Role-Based Access Control (RBAC) Service for managing the user access to the
 * different app APIs
 */
@Service("authz")
public class AccessControlService {

    public enum RESOURCE_OP {list, read, write, all}

    @Autowired
    AuthenticationProperties authenticationProperties;
    @Autowired
    RoleProperties roleProperties;
    @Autowired
    private CustomResourceDefinitionService service;

    // role -> resource -> operations
    private Map<String, Map<String, Set<RESOURCE_OP>>> roleMap = new HashMap<>();

    private static final String[] K8S_RESOURCES = new String[]{"k8s_job", "k8s_service", "k8s_deployment", "k8s_secret", "k8s_pvc"};

    /**
     * Pre-build role model. Map role to list of resources and their permissions.
     */
    @PostConstruct
    public void initRoles() {
        if (roleProperties.getRoles() != null) {

            roleProperties.getRoles().forEach(role -> {
                roleMap.put(role.getRole(), new HashMap<>());
                List<String> resources = role.getResources();
                // each resource has <resource>::<op>  or <resource> syntax with wildcards
                resources.forEach(res -> {
                    RESOURCE_OP op = null;
                    String rName = null;
                    if (!res.contains("::")) {
                        op = RESOURCE_OP.all;
                        rName = res;
                    } else {
                        String[] arr = res.split("::");
                        if (arr[1].equals("*")) op = RESOURCE_OP.all;
                        else op = RESOURCE_OP.valueOf(arr[1]);
                        rName = arr[0];
                    }
                    if (rName.equals("*")) {
                        for (String r: getFullResourceList()) {
                            addRole(roleMap.get(role.getRole()), r, op);
                        }
                    } else {
                        addRole(roleMap.get(role.getRole()), rName, op);
                    }
                });
            });
        }
    }

    private Set<String> getFullResourceList() {
        Set<String> set = new HashSet<String>();
        set.addAll(Arrays.asList(K8S_RESOURCES));
        set.addAll(service.findAll(null, false, PageRequest.ofSize(1000)).getContent().stream().map(r -> r.getId()).toList());
        return set;
    }

    private void addRole(Map<String, Set<RESOURCE_OP>> map, String id, RESOURCE_OP op) {
        Set<RESOURCE_OP> ops = new HashSet<>();
        map.put(id, ops);
        switch (op) {
            case all: ops.add(RESOURCE_OP.all); 
            case write: ops.add(RESOURCE_OP.write);
            case read: ops.add(RESOURCE_OP.read);
            case list: ops.add(RESOURCE_OP.list);
        }
}

    /**
     * Check if the current user can access the specified resource for the specific operation
     * @param resource
     * @param op
     * @return
     */
    public boolean canAccess(String resource, RESOURCE_OP op) {
        // bypass for no auth scenario
        if (!authenticationProperties.isBasicAuthEnabled() && !authenticationProperties.isOAuth2Enabled()) return true;
        
        SecurityContext securityContext = SecurityContextHolder.getContext();
        if (securityContext == null || securityContext.getAuthentication() == null || securityContext.getAuthentication().getAuthorities() == null || securityContext.getAuthentication().getAuthorities().isEmpty()) return false;

        // check roles - associated resources and wildcards
        Collection<? extends GrantedAuthority> authorities = securityContext.getAuthentication().getAuthorities();
        for (GrantedAuthority a : authorities) {
            if (roleMap.containsKey(a.getAuthority())) {
                Map<String, Set<RESOURCE_OP>> opMap = roleMap.get(a.getAuthority());
                // first check explicit
                if (opMap.containsKey(resource)) {
                    if (opMap.get(resource).contains(op)) return true;
                } 
                else if (opMap.containsKey("*")) {
                    if (opMap.get("*").contains(op)) return true;
                }
            }
        }
        return false;
    }

    /**
     * Return map of resource - permissions for the current user given the list of roles of the user
     * @return
     */
    public Map<String, Set<RESOURCE_OP>> getUserPermissions() {
        boolean all = !authenticationProperties.isBasicAuthEnabled() && !authenticationProperties.isOAuth2Enabled();
        if (!all) {
            SecurityContext securityContext = SecurityContextHolder.getContext();
            if (securityContext == null || securityContext.getAuthentication() == null || securityContext.getAuthentication().getAuthorities() == null || securityContext.getAuthentication().getAuthorities().isEmpty()) {
                return Collections.emptyMap();
            }
            Collection<? extends GrantedAuthority> authorities = securityContext.getAuthentication().getAuthorities();
            Map<String, Set<RESOURCE_OP>> result = new HashMap<>();
            for (GrantedAuthority a : authorities) {
                if (roleMap.containsKey(a.getAuthority())) {
                    for (Map.Entry<String, Set<RESOURCE_OP>> entry : roleMap.get(a.getAuthority()).entrySet()) {
                        if (!result.containsKey(entry.getKey())) result.put(entry.getKey(), new HashSet<>(entry.getValue()));
                        else result.put(entry.getKey(), mergeOps(result.get(entry.getKey()), entry.getValue()));
                    }   
                }
            }
            return result;
        } else {
            // all permissions for all resources
            Map<String, Set<RESOURCE_OP>> result = new HashMap<>();
            for (String r: getFullResourceList()) {
                addRole(result, r,  RESOURCE_OP.all);
            }
            return result;
        }
    }

    private Set<RESOURCE_OP> mergeOps(Set<RESOURCE_OP> dest, Set<RESOURCE_OP> src) {
        dest.addAll(src);
        return dest;
    }
}
