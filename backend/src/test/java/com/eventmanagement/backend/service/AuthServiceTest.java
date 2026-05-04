package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.AuthResponse;
import com.eventmanagement.backend.dto.LoginRequest;
import com.eventmanagement.backend.dto.SignupRequest;
import com.eventmanagement.backend.exception.AuthException;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mindrot.jbcrypt.BCrypt;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void signupSavesNewAttendeeWithHashedPasswordAndReturnsToken() {
        SignupRequest request = new SignupRequest();
        request.setName("Nimal Perera");
        request.setEmail("nimal@unievents.lk");
        request.setPassword("Student@12345");
        request.setStudentId("IT001");
        request.setDepartment("Computing");

        when(userRepository.existsByEmail("nimal@unievents.lk")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(7L);
            return saved;
        });
        when(jwtService.generateToken(7L, "nimal@unievents.lk", "ATTENDEE")).thenReturn("jwt-token");

        AuthResponse response = authService.signup(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertThat(savedUser.getRole()).isEqualTo("ATTENDEE");
        assertThat(savedUser.getPassword()).isNotEqualTo("Student@12345");
        assertThat(BCrypt.checkpw("Student@12345", savedUser.getPassword())).isTrue();
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("nimal@unievents.lk");
    }

    @Test
    void signupRejectsAlreadyRegisteredEmail() {
        SignupRequest request = new SignupRequest();
        request.setEmail("duplicate@unievents.lk");

        when(userRepository.existsByEmail("duplicate@unievents.lk")).thenReturn(true);

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(AuthException.class)
                .hasMessage("Email is already registered");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loginReturnsTokenForMatchingPassword() {
        User user = new User();
        user.setId(4L);
        user.setName("Ayesha Silva");
        user.setEmail("ayesha@unievents.lk");
        user.setPassword(BCrypt.hashpw("Student@12345", BCrypt.gensalt()));
        user.setRole("ATTENDEE");

        LoginRequest request = new LoginRequest();
        request.setEmail("ayesha@unievents.lk");
        request.setPassword("Student@12345");

        when(userRepository.findByEmail("ayesha@unievents.lk")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(4L, "ayesha@unievents.lk", "ATTENDEE")).thenReturn("login-token");

        AuthResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("login-token");
        assertThat(response.getId()).isEqualTo(4L);
        assertThat(response.getName()).isEqualTo("Ayesha Silva");
    }

    @Test
    void loginRejectsIncorrectPassword() {
        User user = new User();
        user.setEmail("student@unievents.lk");
        user.setPassword(BCrypt.hashpw("RightPassword1", BCrypt.gensalt()));

        LoginRequest request = new LoginRequest();
        request.setEmail("student@unievents.lk");
        request.setPassword("WrongPassword1");

        when(userRepository.findByEmail("student@unievents.lk")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(AuthException.class)
                .hasMessage("Invalid email or password");
    }

    @Test
    void googleLoginCreatesAttendeeWhenEmailIsNew() {
        when(userRepository.findByEmail("google@unievents.lk")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(12L);
            return saved;
        });
        when(jwtService.generateToken(12L, "google@unievents.lk", "ATTENDEE")).thenReturn("google-token");

        AuthResponse response = authService.googleLogin(Map.of(
                "email", "google@unievents.lk",
                "name", "Google Student"
        ));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        assertThat(userCaptor.getValue().getRole()).isEqualTo("ATTENDEE");
        assertThat(response.getToken()).isEqualTo("google-token");
        assertThat(response.getEmail()).isEqualTo("google@unievents.lk");
    }

    @Test
    void googleLoginRequiresEmail() {
        assertThatThrownBy(() -> authService.googleLogin(Map.of("name", "Missing Email")))
                .isInstanceOf(AuthException.class)
                .hasMessage("Google account email is required");
    }
}
