package dev.datn.foco.util;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dev.datn.foco.dto.respone.CustomerResponse;
import dev.datn.foco.dto.respone.UserResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil implements AuthenticationEntryPoint {
    //Token JWT
    private static final String ACCESS_TOKEN = "ca7331dbe18c034f6c52ad2bd381c5a00ec1d7bdd6af7aa85e6e83421b1b2839";
    private static final String REFRESH_TOKEN = "a59955a796498d72269aa8dbfed0544405d4a354d1dc25bbf90106855e1f8f11";
    //Generate KEY
    private final Key KEY_ACCESS = Keys.hmacShaKeyFor(ACCESS_TOKEN.getBytes(StandardCharsets.UTF_8));
    private final Key KEY_REFRESH = Keys.hmacShaKeyFor(REFRESH_TOKEN.getBytes(StandardCharsets.UTF_8));

    public Map<String,String> generateTokenUsers(UserResponse userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        claims.put("email", userDetails.getEmail());
        claims.put("roleId", userDetails.getRoleName());
        //Access token 15mins
        String accessToken = Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*15))
                .signWith(KEY_ACCESS, SignatureAlgorithm.HS256)
                .compact();
        //Refresh token 7days reset
        String refreshToken = Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*24*7))
                .signWith(KEY_REFRESH,SignatureAlgorithm.HS256)
                .compact();
        return Map.of("access_token", accessToken, "refresh_token", refreshToken);
    }
    public Map<String,String> generateTokenCustomers(CustomerResponse customerResponse) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", customerResponse.getId());
        claims.put("roleId", "CUSTOMER");
        claims.put("email", customerResponse.getEmail());
        claims.put("phone", customerResponse.getPhone());
        //Access token 15mins
        String accessToken = Jwts.builder()
                .setClaims(claims)
                .setSubject(customerResponse.getPhone())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*15))
                .signWith(KEY_ACCESS, SignatureAlgorithm.HS256)
                .compact();
        //Refresh token 7days reset
        String refreshToken = Jwts.builder()
                .setSubject(customerResponse.getPhone())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*24*7))
                .signWith(KEY_REFRESH,SignatureAlgorithm.HS256)
                .compact();
        return Map.of("access_token", accessToken, "refresh_token", refreshToken);
    }
    public Claims extractToken(String token, boolean isRefreshToken) {
        Key key = isRefreshToken ? KEY_REFRESH : KEY_ACCESS;
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
    public String getUsername(String token) {
        return extractToken(token, false).get("username", String.class);
    }
    public String getEmail(String token) {
        return extractToken(token,false).get("email", String.class);
    }
    public Long getId (String token) {return extractToken(token,false).get("id", Long.class);}
    public String getRoleId(String token) {
        return extractToken(token,false).get("roleId",String.class);
    }
    public boolean isExpired(String token) {
        return extractToken(token,false).getExpiration().before(new Date());
    }
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException)
            throws IOException, ServletException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpServletResponse.SC_FORBIDDEN);
        body.put("error", "FORBIDDEN");
        body.put("message", "Token không hợp lệ hoặc chưa đăng nhập");
        body.put("path", request.getRequestURI());

        mapper.writeValue(response.getOutputStream(), body);
    }
}
