package ru.app.authservice.security;

import ru.app.authservice.dto.AuthRequestDTO;
import ru.app.authservice.dto.AuthResponseDTO;
import ru.app.authservice.entity.User;
import ru.app.authservice.enums.Provider;
import ru.app.authservice.enums.TokenType;
import ru.app.authservice.exception.AuthException;
import ru.app.authservice.mapper.UserMapper;
import ru.app.authservice.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityService {
    private static final int HOURS_IN_A_DAY = 24;
    private static final long MILLISECONDS_IN_A_SECOND = 1000L;

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
    public void clearTokens(ServerHttpResponse response) {
        createCookie(response, "access_token", "", Instant.now());
        createCookie(response, "refresh_token", "", Instant.now());
    }

    private TokenDetails generateToken(Map<String, Object> claims, String subject) {
        long accessExpirationTimeInMillis = accessExpirationInSeconds * MILLISECONDS_IN_A_SECOND;
        long refreshExpirationTimeInMillis = accessExpirationInSeconds * HOURS_IN_A_DAY * MILLISECONDS_IN_A_SECOND;

        Date accessExpirationDate = new Date(new Date().getTime() + accessExpirationTimeInMillis);
        Date refreshExpirationDate = new Date(new Date().getTime() + refreshExpirationTimeInMillis);

        return generateToken(accessExpirationDate, refreshExpirationDate, claims, subject);
    }

    private TokenDetails generateToken(Date accessExpirationDate, Date refreshExpirationDate,
                                       Map<String, Object> claims, String subject) {
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

    private String buildToken(Date createdDate, Date expiration,
                              Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuer(issuer)
                .setSubject(subject)
                .setIssuedAt(createdDate)
                .setId(UUID.randomUUID().toString())
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256,
                        Base64.getEncoder().encodeToString(secret.getBytes()))
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
                    setTokens(response, tokenDetails);
                    return Mono.just(buildAuthResponse(tokenDetails));
                });
    }

    public void setTokens(ServerHttpResponse response, TokenDetails tokenDetails){
        createCookie(response, "access_token", tokenDetails.getAccessToken(),
                tokenDetails.getAccessExpiresAt().toInstant());
        createCookie(response, "refresh_token", tokenDetails.getRefreshToken(),
                tokenDetails.getRefreshExpiresAt().toInstant());
    }

    public Mono<TokenDetails> authenticate(String username, String password) {
        return userService.getByUsername(username)
                .flatMap(dto -> {
                    User user = userMapper.responseMap(dto);
                    if (user.getProvider() != Provider.PASSWORD) {
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

    public Mono<AuthResponseDTO> refresh(String refreshToken, ServerHttpResponse response) {
        Claims claims = jwtHandler.getClaimsFromToken(refreshToken, TokenType.REFRESH);
        String username = claims.get("username", String.class);

        return userService.getByUsername(username)
                .flatMap(dto -> {
                    User user = userMapper.responseMap(dto);
                    TokenDetails tokenDetails = generateToken(user).toBuilder().userId(user.getId()).build();
                    setTokens(response, tokenDetails);
                    return Mono.just(buildAuthResponse(generateToken(user).toBuilder()
                            .userId(user.getId())
                            .build()));
                });
    }

    private void createCookie(ServerHttpResponse response, String name, String value, Instant expiresAt) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.between(Instant.now(), expiresAt))
                .build();
        response.addCookie(cookie);
    }
}