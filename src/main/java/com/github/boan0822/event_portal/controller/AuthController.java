package com.github.boan0822.event_portal.controller;

import org.springframework.http.HttpStatus;
import com.github.boan0822.event_portal.config.JwtUtil;
import com.github.boan0822.event_portal.dto.AuthRequest;
import com.github.boan0822.event_portal.dto.AuthResponse;
import com.github.boan0822.event_portal.model.User;
import com.github.boan0822.event_portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        // 找使用者
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("帳號或密碼錯誤"));

        // 比對密碼
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("帳號或密碼錯誤");
        }

        // 產生 JWT Token
        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getRole().name()
        );

        return ResponseEntity.ok(
            new AuthResponse(token, user.getUsername(), user.getRole().name())
        );
    }
        // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {

        // 檢查帳號是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("帳號已存在");
        }

        // 建立新使用者
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);  // 一般註冊都是 USER 角色
        userRepository.save(user);

        // 註冊完直接發 Token，不需要再登入一次
        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getRole().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            new AuthResponse(token, user.getUsername(), user.getRole().name())
        );
    }
}