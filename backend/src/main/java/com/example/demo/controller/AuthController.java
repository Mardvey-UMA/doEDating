package com.example.demo.controller;

import com.example.demo.dto.RefreshDTO;
import com.example.demo.security.oauth.OAuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import com.example.demo.dto.AuthRequestDTO;
import com.example.demo.dto.AuthResponseDTO;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.security.CustomPrincipal;
import com.example.demo.security.SecurityService;
import com.example.demo.service.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final SecurityService securityService;
    private final UserServiceImpl userService;
    private final OAuthService oAuthService;

    @Value("${front.redirect-uri}")
    private String redirectUrlAuthVk;

    @Operation(
            summary = "Вход пользователя",
            description = "Авторизация пользователя с использованием учетных данных.")
    @PostMapping("/login")
    public Mono<AuthResponseDTO> login(@RequestBody AuthRequestDTO dto, ServerHttpResponse response) {
        return securityService.login(dto, response);
    }

    @Operation(
            summary = "Обновление токена",
            description = "Обновить токен доступа с использованием refresh-токена.")
    @PostMapping("/refresh")
    public Mono<AuthResponseDTO> refresh(
            @CookieValue("refresh_token") String refreshToken,
            ServerHttpResponse response) {
        return securityService.refresh(refreshToken, response);
    }

    @GetMapping("/oauth2/vk")
    public Mono<Void> oauth2(@RegisteredOAuth2AuthorizedClient("vk") OAuth2AuthorizedClient authorizedClient) {
        return null;
    }

    @GetMapping("/login/oauth2/code/vk")
    public Mono<Void> handleRedirect(@RequestParam("code") String code, ServerHttpResponse response) {
        return oAuthService.authenticate(code, response)
                .flatMap(authResponse -> {

                    String redirectUrl = String.format(redirectUrlAuthVk, authResponse.getAccessToken(), authResponse.getAccessExpiresAt().getTime());

                    response.setStatusCode(HttpStatus.FOUND);
                    response.getHeaders().setLocation(URI.create(redirectUrl));
                    return Mono.empty();
                });
    }
}
