package dev.datn.foco.service;

import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.respone.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest authRequest);
    AuthResponse refreshToken(String token);
}
