package com.github.boan0822.event_portal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")  // 所有 /api 開頭的路由
                .allowedOrigins("*")    // 允許所有來源
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH");
    }
}