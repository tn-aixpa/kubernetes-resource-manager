package it.smartcommunitylab.dhub.rm;

import org.springframework.http.MediaType;

public final class SystemKeys {

    public static final MediaType MEDIA_TYPE_YML = MediaType.valueOf("text/yml");
    public static final MediaType MEDIA_TYPE_YAML = MediaType.valueOf("text/yaml");
    public static final MediaType MEDIA_TYPE_X_YAML = MediaType.valueOf("application/x-yaml");

    public static final String API_PATH = "/api";
    public static final String REGEX_CRD_ID = "[a-z0-9-]+(?:\\.[a-z0-9-]+)+";
    public static final String REGEX_SCHEMA_ID = "[a-z0-9-]+";
    public static final String REGEX_CR_ID = "[a-z0-9-]+";

    public static final String ERROR_NO_CRD = "No CRD with this ID";
    public static final String ERROR_NO_STORED_VERSION = "No version stored for this CRD";
    public static final String ERROR_CRD_NOT_ALLOWED = "Access to this CRD is not allowed";
    public static final String ERROR_NO_CR = "No CR with this ID and CRD ID";
    public static final String ERROR_NO_CR_WITH_VERSION = "No CR with this ID, CRD ID and version";
    public static final String ERROR_NO_SCHEMA = "No schema with this ID";
    public static final String ERROR_NO_SCHEMA_WITH_VERSION = "No schema found for this CRD and version";
    public static final String ERROR_SCHEMA_EXISTS = "Schema with this ID already exists";
    public static final String ERROR_NULL_INPUT = "Input cannot be null";
    public static final String ERROR_K8S_NO_CRD = "No such CRD exists in Kubernetes";

    private SystemKeys() {}
}
