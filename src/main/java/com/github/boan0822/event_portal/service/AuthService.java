package com.github.boan0822.event_portal.service;

import com.github.boan0822.event_portal.config.JwtUtil;
import com.github.boan0822.event_portal.dto.AuthRequest;
import com.github.boan0822.event_portal.model.User;
import com.github.boan0822.event_portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 註冊（預設是 USER 角色）
    public Map<String, String> register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        // 密碼一定要加密後再存，絕對不能存明文
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return Map.of("token", token, "role", user.getRole().name(), "username", user.getUsername());
    }

    // 登入
    public Map<String, String> login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        // 用 BCrypt 比對密碼
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return Map.of("token", token, "role", user.getRole().name(), "username", user.getUsername());
    }
}