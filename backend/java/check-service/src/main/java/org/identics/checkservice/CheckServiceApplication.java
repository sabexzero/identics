package org.identics.checkservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CheckServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CheckServiceApplication.class, args);
    }
}
