package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.AuthResponse;
import com.eventmanagement.backend.dto.LoginRequest;
import com.eventmanagement.backend.dto.ProfileUpdateRequest;
import com.eventmanagement.backend.dto.SignupRequest;
import com.eventmanagement.backend.exception.AuthException;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password"));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        user.setStudentId(request.getStudentId());
        user.setDepartment(request.getDepartment());
        user.setRole(request.getRole() != null ? request.getRole() : "ATTENDEE");

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    /**
     * Google OAuth login: find existing user by email or auto-register them.
     * Called after the frontend verifies the Google token and retrieves the profile.
     */
    public AuthResponse googleLogin(Map<String, String> profile) {
        String email   = profile.get("email");
        String name    = profile.getOrDefault("name", email.split("@")[0]);

        if (email == null || email.isBlank()) {
            throw new AuthException("Google account email is required");
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            // First-time Google login — auto-register the user
            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(email);
            // Set a random secure password (user cannot log in via password)
            newUser.setPassword(BCrypt.hashpw(UUID.randomUUID().toString(), BCrypt.gensalt()));
            newUser.setRole("ATTENDEE");
            return userRepository.save(newUser);
        });

        return buildAuthResponse(user);
    }

    public AuthResponse getProfile(User user) {
        return buildAuthResponse(user);
    }

    public AuthResponse updateProfile(User user, ProfileUpdateRequest request) {
        userRepository.findByEmail(request.getEmail())
                .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                .ifPresent(existingUser -> {
                    throw new AuthException("Email is already registered");
                });

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setStudentId(request.getStudentId());
        user.setDepartment(request.getDepartment());
        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getStudentId(), user.getDepartment());
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
