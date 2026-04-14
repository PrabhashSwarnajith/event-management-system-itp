package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.AuthResponse;
import com.eventmanagement.backend.dto.LoginRequest;
import com.eventmanagement.backend.dto.SignupRequest;
import com.eventmanagement.backend.exception.AuthException;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password"));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password");
        }

        // Generating a simple pseudo-token for the university project
        String simpleToken = UUID.randomUUID().toString() + "-" + user.getId();

        return new AuthResponse(simpleToken, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        
        // Default to ATTENDEE if no role is provided
        user.setRole(request.getRole() != null ? request.getRole() : "ATTENDEE");

        userRepository.save(user);

        String simpleToken = UUID.randomUUID().toString() + "-" + user.getId();
        return new AuthResponse(simpleToken, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
