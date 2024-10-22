package com.example.demo.security.oauth;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.dto.AuthResponseDTO;
import com.example.demo.dto.UserRequestDTO;
import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.SecurityService;
import com.example.demo.security.TokenDetails;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class OAuthService {
    private final WebClient webClient;
    private final UserRepository userRepository;
    private final SecurityService securityService;
    private final UserService userService;
    private final UserMapper userMapper;
    private final ObjectMapper objectMapper;

    @Value("${spring.security.oauth2.client.registration.vk.clientId}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.vk.clientSecret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.vk.redirect-uri}")
    private String redirectUri;

    private Mono<TokenDetails> authenticate(User user) {
        return Mono.just(securityService.generateToken(user).toBuilder()
                .userId(user.getId())
                .build());
    }

    public Mono<AuthResponseDTO> authenticate(String code, ServerHttpResponse response) {
        return webClient
                .get()
                .uri("https://oauth.vk.com/access_token?client_id=" + clientId +
                        "&client_secret=" + clientSecret +
                        "&redirect_uri=" + redirectUri +
                        "&code=" + code)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(vkResponse -> {
                    String accessToken = extractAccessTokenVk(vkResponse);
                    String userId = extractUserIdVk(vkResponse);
                    Long vkId = Long.parseLong(userId);

                    return getUserInfoVk(accessToken, userId).flatMap(userInfoResponse -> {
                        JsonNode jsonNode = parseJson(userInfoResponse);
                        JsonNode userResponse = jsonNode.get("response").get(0);
                        String firstName = userResponse.get("first_name").asText();
                        String lastName = userResponse.get("last_name").asText();
                        String domain = userResponse.get("domain").asText();

                        return userRepository.findByVkId(vkId)
                                .flatMap(this::authenticate)
                                .switchIfEmpty(userService.createVk(UserRequestDTO.builder()
                                                .firstName(firstName)
                                                .lastName(lastName)
                                                .username(domain)
                                                .build(), vkId)
                                        .flatMap(createdUser -> authenticate(userMapper.responseMap(createdUser))))
                                .flatMap(tokenDetails -> {
                                    securityService.setTokens(response, tokenDetails);
                                    return Mono.just(securityService.buildAuthResponse(tokenDetails));
                                });
                    });
                });
    }

    public Mono<String> getUserInfoVk(String accessToken, String userId) {
        return webClient
                .get()
                .uri("https://api.vk.com/method/users.get?user_ids=" + userId +
                        "&fields=domain&access_token=" + accessToken + "&v=5.131")
                .retrieve()
                .bodyToMono(String.class);
    }

    public String extractAccessTokenVk(String jsonResponse) {
        try {
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            return jsonNode.path("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract access token", e);
        }
    }

    public String extractUserIdVk(String jsonResponse) {
        try {
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            return jsonNode.path("user_id").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract user ID", e);
        }
    }

    private JsonNode parseJson(String response) {
        try {
            return objectMapper.readTree(response);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse JSON", e);
        }
    }
}