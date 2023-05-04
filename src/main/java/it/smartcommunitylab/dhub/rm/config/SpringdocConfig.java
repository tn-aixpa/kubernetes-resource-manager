package it.smartcommunitylab.dhub.rm.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;

@Configuration
@SecurityScheme(
  type = SecuritySchemeType.HTTP,
  name = "basicAuth",
  scheme = "basic")
@SecurityScheme(
  type = SecuritySchemeType.HTTP,
  name = "jwtAuth",
  scheme = "bearer",
  bearerFormat = "JWT")
public class SpringdocConfig {}
