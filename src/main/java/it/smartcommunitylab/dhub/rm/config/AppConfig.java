package it.smartcommunitylab.dhub.rm.config;

import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import io.fabric8.kubernetes.client.ConfigBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.Resource;

@Configuration
@Import(JacksonAutoConfiguration.class)
public class AppConfig {

    @Value("${kubernetes.config}")
    private Resource configPath;

    @Value("${kubernetes.config}")
    private String kubeConfig;

    @Value("${kubernetes.namespace}")
    private String namespace;

    @Value("${security.cors.origins}")
    private String corsOrigins;

    @Bean
    public KubernetesClient kubernetesClient() throws IOException {
        //support either auto-configuration or explicit config
        if (configPath != null && configPath.exists()) {
            return new KubernetesClientBuilder().withConfig(configPath.getInputStream()).build();
        }

        ConfigBuilder config = new ConfigBuilder();
        config.withNamespace(namespace);

        return new KubernetesClientBuilder().withConfig(config.build()).build();
    }

    @Bean
    @Qualifier("yamlObjectMapper")
    public YAMLMapper yamlMapper() {
        return new YAMLMapper();
    }
}
