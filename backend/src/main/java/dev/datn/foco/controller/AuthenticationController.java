package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiResponse;
import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.respone.AuthResponse;
import dev.datn.foco.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping(ApiVersion.API_VERSION+"/auth")
@RestController
public class AuthenticationController {
    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        return ApiResponse.<AuthResponse>builder().code(200).message("Đăng nhập thành công").data(authService.login(authRequest)).build() ;
    }
    @GetMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@RequestParam String token) {
        return  ApiResponse.<AuthResponse>builder().code(200).message("Đăng nhập thành công").data(authService.refreshToken(token)).build();
    }
}
