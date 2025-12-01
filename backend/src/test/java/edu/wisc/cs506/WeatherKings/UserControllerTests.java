package edu.wisc.cs506.WeatherKings;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserController.class)
class UserControllerTests {

    @Autowired
    private MockMvc mockMvc;
    
    @SuppressWarnings("removal")
    @MockBean
    private UserService service;

    @Test
    void testRegister() throws Exception {
        // registration returns 201
        when(service.createUser(any(User.class))).thenReturn("Account created successfully!");
        mockMvc.perform(post("/api/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"a\",\"password\":\"b\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Account created successfully!"));
    }

    @Test
    void testLoginOk() throws Exception {
        // valid login
        when(service.validateUser("kris", "123")).thenReturn(true);
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"kris\",\"password\":\"123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful."));
    }

    @Test
    void testLoginFail() throws Exception {
        // invalid login
        when(service.validateUser("kris", "bad")).thenReturn(false);
        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"kris\",\"password\":\"bad\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid credentials."));
    }
}
