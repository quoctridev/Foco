package dev.datn.foco.service;

import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.respone.AuthRespone;

public interface AuthService {
    AuthRespone login(AuthRequest authRequest);
    AuthRespone refreshToken(String token);
}
