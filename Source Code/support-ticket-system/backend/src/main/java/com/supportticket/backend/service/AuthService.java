package com.supportticket.backend.service;

import com.supportticket.backend.dto.request.LoginRequest;
import com.supportticket.backend.dto.request.RegisterRequest;
import com.supportticket.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}