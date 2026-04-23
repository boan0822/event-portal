package com.github.boan0822.event_portal.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;  // 存加密過的密碼，不存明文

    @Enumerated(EnumType.STRING)
    private Role role;

    // 兩種角色：一般使用者和管理員
    public enum Role {
        USER, ADMIN
    }
}