package it.smartcommunitylab.dhub.rm.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.smartcommunitylab.dhub.rm.SystemKeys;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.filter.ShallowEtagHeaderFilter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.EncodedResourceResolver;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    FilterRegistrationBean<ShallowEtagHeaderFilter> shallowEtagFilter() {
        FilterRegistrationBean<ShallowEtagHeaderFilter> filter = new FilterRegistrationBean<>();
        filter.setFilter(new ShallowEtagHeaderFilter());
        filter.addUrlPatterns("/static/*");
        return filter;
    }

    /*
     * Static console resolvers for webpack style
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // user console
        registry
            .addResourceHandler("/public/**")
            .addResourceLocations("classpath:/frontend/")
            .setCachePeriod(60 * 60 * 24 * 365)/* one year */
            .resourceChain(true)
            .addResolver(new EncodedResourceResolver())
            .addResolver(new PathResourceResolver());
        // registry
        //     .addResourceHandler("/console/**")
        //     .addResourceLocations("classpath:/frontend/", "file:frontend/build/")
        //     .setCachePeriod(60 * 60 * 24 * 365)/* one year */
        //     .resourceChain(true)
        //     .addResolver(
        //         new PathResourceResolver() {
        //             @Override
        //             protected Resource getResource(String resourcePath, Resource location) throws IOException {
        //                 //lookup for a static file matching the path
        //                 Resource requestedResource = location.createRelative(resourcePath);
        //                 if (requestedResource.exists() && requestedResource.isReadable()) {
        //                     return requestedResource;
        //                 }

        //                 // return the index, the path is a logical route
        //                 return new ClassPathResource("/frontend/index.html");
        //             }
        //         }
        //     );
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        // configure a sane path mapping by disabling content negotiation via extensions
        // the default breaks every single mapping which receives a path ending with
        // '.x', like 'user.roles.me'
        configurer.favorParameter(false); //                .favorPathExtension(false) // disable path extension, as of 5.3 is false by default

        // add mediatypes
        configurer
            .ignoreAcceptHeader(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType(MediaType.APPLICATION_JSON.getSubtype(), MediaType.APPLICATION_JSON)
            .mediaType(SystemKeys.MEDIA_TYPE_YML.getSubtype(), SystemKeys.MEDIA_TYPE_YML)
            .mediaType(SystemKeys.MEDIA_TYPE_YAML.getSubtype(), SystemKeys.MEDIA_TYPE_YAML)
            .mediaType(SystemKeys.MEDIA_TYPE_X_YAML.getSubtype(), SystemKeys.MEDIA_TYPE_X_YAML);
    }

    /*
     * Yaml support (experimental)
     */

    @Autowired
    @Qualifier("yamlObjectMapper")
    private ObjectMapper yamlObjectMapper;

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter yamlConverter = new MappingJackson2HttpMessageConverter(yamlObjectMapper);
        yamlConverter.setSupportedMediaTypes(
            Arrays.asList(SystemKeys.MEDIA_TYPE_YML, SystemKeys.MEDIA_TYPE_YAML, SystemKeys.MEDIA_TYPE_X_YAML)
        );
        converters.add(yamlConverter);
    }
}
