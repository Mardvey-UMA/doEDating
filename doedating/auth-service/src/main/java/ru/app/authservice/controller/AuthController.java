package ru.app.authservice.controller;

import org.springframework.beans.factory.annotation.Value;
import ru.app.authservice.dto.AuthRequestDTO;
import ru.app.authservice.dto.AuthResponseDTO;
import ru.app.authservice.dto.UserRequestDTO;
import ru.app.authservice.dto.UserResponseDTO;
import ru.app.authservice.security.SecurityService;
import ru.app.authservice.security.oauth.OAuthService;
import ru.app.authservice.service.UserService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
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
    private final UserService userService;
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

    @Operation(
            summary = "OAuth2 авторизация через VK",
            description = "Обработка OAuth2 авторизации через ВКонтакте.")
    @GetMapping("/oauth2/vk")
    public Mono<Void> oauth2(@RegisteredOAuth2AuthorizedClient("vk") OAuth2AuthorizedClient authorizedClient) {
        return null;
    }

    @Operation(
            summary = "Выход пользователя",
            description = "Удаляет токены из cookies и делает их недействительными.")
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public Mono<Void> logout(ServerHttpResponse response) {
        securityService.clearTokens(response);
        return Mono.empty();
    }

//    @Hidden
//    @GetMapping("/login/oauth2/code/vk")
//    public Mono<AuthResponseDTO> handleRedirect(@RequestParam("code") String code,  ServerHttpResponse response) {
//        return oAuthService.authenticate(code, response);
//    }

    @Hidden
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

    @Operation(
            summary = "Регистрация нового пользователя",
            description = "Создает нового пользователя на основе переданных данных.")
    @PostMapping(value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UserResponseDTO> createUser(@RequestBody UserRequestDTO userDTO) {
        return userService.create(userDTO);
    }

}
