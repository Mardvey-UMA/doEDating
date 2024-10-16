package com.example.demo.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class TokenDetails {
    private Long userId;
    private String accessToken;
    private Date accessIssuedAt;
    private Date accessExpiresAt;
    private String refreshToken;
    private Date refreshIssuedAt;
    private Date refreshExpiresAt;
}
