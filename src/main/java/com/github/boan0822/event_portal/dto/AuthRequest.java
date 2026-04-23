package com.github.boan0822.event_portal.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}