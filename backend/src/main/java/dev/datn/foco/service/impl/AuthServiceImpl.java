package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.respone.AuthResponse;
import dev.datn.foco.dto.respone.UserResponse;
import dev.datn.foco.model.Role;
import dev.datn.foco.model.User;
import dev.datn.foco.repository.RoleRepository;
import dev.datn.foco.repository.UserRepository;
import dev.datn.foco.service.AuthService;
import dev.datn.foco.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public AuthResponse login(AuthRequest authRequest) {
        String input = authRequest.getUsername().trim();

        User user = userRepository.findByUsernameIgnoreCase(input)
                .orElseGet(() -> userRepository.findByEmailIgnoreCase(input)
                        .orElseThrow(() -> new IllegalArgumentException("Tài khoản '" + input + "' không tồn tại")));

        if(!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }
        Role role = roleRepository.findById(user.getRole().getRoleId()).orElseThrow(()->new IllegalArgumentException("Vai trò không có trong hệ thống"));
        Map<String, String> map = jwtUtil.generateTokenUsers(UserResponse.builder().username(user.getUsername()).roleName(role.getRoleName().toString()).email(user.getEmail()).build());
        return AuthResponse.builder().token(map.get("access_token")).refreshToken(map.get("refresh_token")).authorized(true).build();
    }
    @Override
    public AuthResponse refreshToken(String token) {
        try{
            Claims claims = jwtUtil.extractToken(token, true);
            String username = claims.getSubject();
            System.out.println(username);
            User user = userRepository.findByUsernameIgnoreCase(username)
                    .orElseGet(() -> userRepository.findByEmailIgnoreCase(username)
                            .orElseThrow(() -> new IllegalArgumentException("Tài khoản '" + username + "' không tồn tại")));

            Map<String, String> map = jwtUtil.generateTokenUsers(UserResponse.builder().username(user.getUsername()).roleName(user.getRole().getRoleName().toString()).email(user.getEmail()).build());
            return AuthResponse.builder().token(map.get("access_token")).refreshToken(map.get("refresh_token")).authorized(true).build();
        }catch (Exception e) {
            System.out.println(e.getMessage());
            throw new IllegalArgumentException("Token không hợp lệ hoặc đã hết hạn");
        }
    }

}
