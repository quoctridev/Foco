package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiRespone;
import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.respone.AuthRespone;
import dev.datn.foco.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping(ApiVersion.API_VERSION+"/auth")
@RestController
public class AuthenticationController {
    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public ApiRespone<AuthRespone> login(@RequestBody AuthRequest authRequest) {
        return ApiRespone.<AuthRespone>builder().code(200).message("Đăng nhập thành công").data(authService.login(authRequest)).build() ;
    }
    @GetMapping("/refresh")
    public ApiRespone<AuthRespone> refresh(@RequestParam String token) {
        return  ApiRespone.<AuthRespone>builder().code(200).message("Đăng nhập thành công").data(authService.refreshToken(token)).build();
    }
}
