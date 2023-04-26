package it.smartcommunitylab.dhub.rm.config;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;

@Configuration
public class AppConfig {
    @Bean
    public KubernetesClient kubernetesClient(@Value("${kubernetes.config}") String configPath) throws IOException {
        Config config = Config.fromKubeconfig(Files.readString(Path.of(configPath)));
        return new KubernetesClientBuilder().withConfig(config).build();
    }
}
