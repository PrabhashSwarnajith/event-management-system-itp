package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.UserProfileRequest;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
            return user;
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(UserProfileRequest profileRequest) {
        User user = getCurrentUser();
        String firstName = profileRequest.getFirstName();
        String lastName = profileRequest.getLastName();

        if (firstName != null || lastName != null) {
            String updatedName = String.join(" ",
                    firstName == null ? "" : firstName.trim(),
                    lastName == null ? "" : lastName.trim()).trim();

            if (!updatedName.isBlank()) {
                user.setName(updatedName);
            }
        }

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
