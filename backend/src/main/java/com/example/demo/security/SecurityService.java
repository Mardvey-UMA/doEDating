package com.example.demo.security;

import com.example.demo.dto.AuthRequestDTO;
import com.example.demo.dto.AuthResponseDTO;
import com.example.demo.dto.RefreshDTO;
import com.example.demo.enums.Provider;
import com.example.demo.enums.TokenType;
import com.example.demo.mapper.UserMapper;
import com.example.demo.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import com.example.demo.entity.User;
import com.example.demo.exception.AuthException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtHandler jwtHandler;

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private Integer accessExpirationInSeconds;
    @Value("${jwt.issuer}")
    private String issuer;

    public TokenDetails generateToken(User user) {
        Map<String, Object> claims = new HashMap<>() {{
            put("role", user.getRole());
            put("username", user.getUsername());

        }};
        return generateToken(claims, user.getId().toString());
    }

    private TokenDetails generateToken(Map<String, Object> claims, String subject) {
        long accessExpirationTimeInMillis = accessExpirationInSeconds * 1000L;
        long refreshExpirationTimeInMillis = accessExpirationInSeconds * 24 * 1000L;
        Date accessExpirationDate = new Date(new Date().getTime() + accessExpirationTimeInMillis);
        Date refreshExpirationDate = new Date(new Date().getTime() + refreshExpirationTimeInMillis);

        return generateToken(accessExpirationDate, refreshExpirationDate, claims, subject);
    }


    private TokenDetails generateToken(Date accessExpirationDate, Date refreshExpirationDate, Map<String, Object> claims, String subject) {
        Date createdDate = new Date();
        Map<String, Object> refreshClaims = new HashMap<>(claims);
        refreshClaims.put("token_type", TokenType.REFRESH);
        Map<String, Object> accessClaims = new HashMap<>(claims);
        accessClaims.put("token_type", TokenType.ACCESS);
        String accessToken = buildToken(createdDate, accessExpirationDate, accessClaims, subject);
        String refreshToken = buildToken(createdDate, refreshExpirationDate, refreshClaims, subject);

        return TokenDetails.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessIssuedAt(createdDate)
                .accessExpiresAt(accessExpirationDate)
                .refreshExpiresAt(refreshExpirationDate)
                .build();
    }

    private String buildToken(Date createdDate, Date expiration, Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuer(issuer)
                .setSubject(subject)
                .setIssuedAt(createdDate)
                .setId(UUID.randomUUID().toString())
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, Base64.getEncoder().encodeToString(secret.getBytes()))
                .compact();

    }

    public AuthResponseDTO buildAuthResponse(TokenDetails tokenDetails) {
        return AuthResponseDTO.builder()
                .userId(tokenDetails.getUserId())
                .accessToken(tokenDetails.getAccessToken())
                .refreshToken(tokenDetails.getRefreshToken())
                .issuedAt(tokenDetails.getAccessIssuedAt())
                .accessExpiresAt(tokenDetails.getAccessExpiresAt())
                .refreshExpiresAt(tokenDetails.getRefreshExpiresAt())
                .build();

    }

    public Mono<AuthResponseDTO> login(AuthRequestDTO dto, ServerHttpResponse response) {
        return authenticate(dto.getUsername(), dto.getPassword())
                .flatMap(tokenDetails -> {
                    setAccessTokenInCookie(response, tokenDetails.getAccessToken());
                    return Mono.just(buildAuthResponse(tokenDetails));
                });
    }


    public Mono<TokenDetails> authenticate(String username, String password) {
        return userService.getByUsername(username)
                .flatMap(dto -> {
                    User user = userMapper.responseMap(dto);
                    if (user.getProvider() != Provider.PASSWORD){
                        return Mono.error(new AuthException("Invalid provider", "INVALID_PROVIDER"));
                    }
                    if (!user.isEnabled()) {
                        return Mono.error(new AuthException("Account disabled", "USER_ACCOUNT_DISABLED"));
                    }

                    if (!passwordEncoder.matches(password, user.getPassword())) {
                        return Mono.error(new AuthException("Invalid password", "INVALID_PASSWORD"));
                    }

                    return Mono.just(generateToken(user).toBuilder()
                            .userId(user.getId())
                            .build());
                })
                .switchIfEmpty(Mono.error(new AuthException("Invalid username", "INVALID_USERNAME")));
    }


    public Mono<AuthResponseDTO> refresh(RefreshDTO refreshDTO, ServerHttpResponse response) {
        String refreshToken = refreshDTO.getRefreshToken();
        Claims claims = jwtHandler.getClaimsFromToken(refreshToken, TokenType.REFRESH);
        String username = claims.get("username", String.class);

        return userService.getByUsername(username)
                .flatMap(dto -> {
                    User user = userMapper.responseMap(dto);

                    TokenDetails tokenDetails = generateToken(user).toBuilder()
                            .userId(user.getId())
                            .build();

                    setAccessTokenInCookie(response, tokenDetails.getAccessToken());

                    return Mono.just(buildAuthResponse(tokenDetails));
                });
    }

    public void setAccessTokenInCookie(ServerHttpResponse response, String accessToken) {
        ResponseCookie cookie = ResponseCookie.from("access_token", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofSeconds(accessExpirationInSeconds))
                .build();
        response.addCookie(cookie);
    }
}
