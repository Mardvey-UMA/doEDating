package com.example.demo.controller;

import com.example.demo.dto.RefreshDTO;
import com.example.demo.security.oauth.OAuthService;
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

    @PostMapping("/login")
    public Mono<AuthResponseDTO> login(@RequestBody AuthRequestDTO dto, ServerHttpResponse response) {
        return securityService.login(dto, response);
    }

    @PostMapping("/refresh")
    public Mono<AuthResponseDTO> refresh(@RequestBody RefreshDTO dto, ServerHttpResponse response) {
        return securityService.refresh(dto, response)
                .flatMap(authResponse -> {
                    securityService.setAccessTokenInCookie(response, authResponse.getAccessToken());
                    return Mono.just(authResponse);
                });
    }

    @GetMapping("/oauth2/vk")
    public Mono<Void> oauth2(@RegisteredOAuth2AuthorizedClient("vk") OAuth2AuthorizedClient authorizedClient) {
        return null;
    }

    @GetMapping("/login/oauth2/code/vk")
    public Mono<Void> handleRedirect(@RequestParam("code") String code, ServerHttpResponse response) {
        return oAuthService.authenticate(code)
                .flatMap(authResponse -> {

                    String redirectUrl = String.format(redirectUrlAuthVk,
                            authResponse.getAccessToken(), authResponse.getUserId());

                    response.setStatusCode(HttpStatus.FOUND);
                    response.getHeaders().setLocation(URI.create(redirectUrl));
                    return Mono.empty();
                });
    }


    @GetMapping("/info")
    public Mono<UserResponseDTO> getUserInfo(Authentication authentication) {
        CustomPrincipal customPrincipal = (CustomPrincipal) authentication.getPrincipal();
        return userService.getById(customPrincipal.getId());
    }
}
