package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@Disabled
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTestOld {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    AuthenticationManager authenticationManager;
    @MockBean
    private JwtUtils jwtUtils;
    @MockBean
    private PasswordEncoder passwordEncoder;

    @Test
    void testLogin_Success() throws Exception {
        UserDetailsImpl fakeUserDetails =
                new UserDetailsImpl(
                        1L,
                        "user@example.com",
                        "First",
                        "Last",
                        true,
                        String.valueOf(new ArrayList<>())
                );

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(fakeUserDetails, null, fakeUserDetails.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authenticationToken);
        when(userRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(new User("user@example.com", "Last", "First", "encodePass", true)));
        when(jwtUtils.generateJwtToken(any(Authentication.class))).thenReturn("fakeJwtToken");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"email\": \"test@example.com\", \"password\": \"password\" }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fakeJwtToken"))
                .andExpect(jsonPath("$.admin").value(true));
    }

    @Test
    void testLogin_MissingMail() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{  \"password\": \"wrongPassword\" }"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));


        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"email\": \"wrong@example.com\", \"password\": \"wrongPassword\" }"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registerUser_Success() throws Exception {
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodePass");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"email\": \"user@example.com\",\"password\": \"password\",\"firstName\": \"John\",\"lastName\": \"Doe\" }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
        verify(userRepository).save(argThat(user -> user.getEmail().equals("user@example.com") && user.getPassword().equals("encodePass")));
    }

    @Test
    void registerUser_EmailAlreadyExist() throws Exception {
        when(userRepository.existsByEmail("user@example.com")).thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"email\": \"user@example.com\",\"password\": \"password\",\"firstName\": \"John\",\"lastName\": \"Doe\" }"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Test
    void registerUser_MissingMail() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ \"password\": \"password\",\"firstName\": \"John\",\"lastName\": \"Doe\" }"))
                .andExpect(status().isBadRequest());
    }
}