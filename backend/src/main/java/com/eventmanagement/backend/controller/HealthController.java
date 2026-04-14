package com.eventmanagement.backend.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Map<String, Object> health() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "Backend online");
        response.put("service", "event-management-backend");
        response.put("message", "Spring Boot is running and ready for frontend integration.");
        response.put("timestamp", Instant.now().toString());
        return response;
    }
}

