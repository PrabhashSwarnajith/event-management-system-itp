package com.eventmanagement.backend.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final String SECRET = "event-management-system-local-jwt-secret-change-before-production";
    private static final long EXPIRATION_SECONDS = 60L * 60L * 24L;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(Long userId, String email, String role) {
        try {
            Map<String, Object> header = new LinkedHashMap<>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", email);
            payload.put("userId", userId);
            payload.put("role", role);
            payload.put("exp", Instant.now().getEpochSecond() + EXPIRATION_SECONDS);

            String headerPart = encodeJson(header);
            String payloadPart = encodeJson(payload);
            String unsignedToken = headerPart + "." + payloadPart;
            return unsignedToken + "." + sign(unsignedToken);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not generate JWT", ex);
        }
    }

    public String extractEmail(String token) {
        return String.valueOf(readPayload(token).get("sub"));
    }

    public boolean isTokenValid(String token, String email) {
        Map<String, Object> payload = readPayload(token);
        Number expiration = (Number) payload.get("exp");
        return email.equals(payload.get("sub"))
                && expiration.longValue() > Instant.now().getEpochSecond()
                && isSignatureValid(token);
    }

    private Map<String, Object> readPayload(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT format");
            }
            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            return objectMapper.readValue(decoded, new TypeReference<>() {});
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid JWT", ex);
        }
    }

    private boolean isSignatureValid(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }
        String unsignedToken = parts[0] + "." + parts[1];
        return sign(unsignedToken).equals(parts[2]);
    }

    private String encodeJson(Map<String, Object> value) throws Exception {
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(objectMapper.writeValueAsBytes(value));
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign JWT", ex);
        }
    }
}
