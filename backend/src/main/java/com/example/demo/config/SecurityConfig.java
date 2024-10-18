package com.example.demo.config;

import com.example.demo.security.CustomPrincipal;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import com.example.demo.security.AuthenticationManager;
import com.example.demo.security.JwtHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultReactiveOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.web.server.ServerWebExchange;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Slf4j
@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {
    @Value("${jwt.secret}")
    private String secret;

    private final String[] publicRoutes = {
            "/api/auth/login",
            "/api/auth/refresh",
            "/api/auth/oauth2/vk",
            "/api/auth/login/**",
            "/swagger-ui.html",
            "/webjars/swagger-ui/**",
            "/v3/api-docs/**", // OpenAPI docs
            "/swagger-resources/**", // Swagger resources
            "/v3/api-docs", // OpenAPI docs endpoint
            "/swagger-ui/index.html", // Swagger UI main page
            "/swagger-ui/**" // Swagger UI assets
    };


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ReactiveOAuth2AuthorizedClientManager authorizedClientManager(
            ReactiveClientRegistrationRepository clientRegistrationRepository,
            ServerOAuth2AuthorizedClientRepository authorizedClientRepository) {

        ReactiveOAuth2AuthorizedClientProvider authorizedClientProvider =
                ReactiveOAuth2AuthorizedClientProviderBuilder.builder()
                        .authorizationCode()
                        .refreshToken()
                        .clientCredentials()
                        .build();

        DefaultReactiveOAuth2AuthorizedClientManager authorizedClientManager =
                new DefaultReactiveOAuth2AuthorizedClientManager(clientRegistrationRepository, authorizedClientRepository);
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);
        return authorizedClientManager;
    }

    @Bean
    WebClient webClient(ReactiveOAuth2AuthorizedClientManager authorizedClientManager) {
        ServerOAuth2AuthorizedClientExchangeFilterFunction oauth2Client =
                new ServerOAuth2AuthorizedClientExchangeFilterFunction(authorizedClientManager);
        return WebClient.builder()
                .filter(oauth2Client)
                .build();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http, AuthenticationManager authenticationManager) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(authorize -> authorize
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .pathMatchers(publicRoutes).permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/users").permitAll()
                        .anyExchange().authenticated())

                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((swe, e) -> {
                            log.error("Unauthorized error: {}", e.getMessage());
                            return Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED));
                        })
                        .accessDeniedHandler((swe, e) -> {
                            log.error("Access denied: {}", e.getMessage());
                            return Mono.fromRunnable(() -> swe.getResponse().setStatusCode(HttpStatus.FORBIDDEN));
                        })
                )
                .addFilterAt(bearerAuthenticationFilter(authenticationManager), SecurityWebFiltersOrder.AUTHENTICATION)
                .oauth2Login(withDefaults())
                .build();
    }

    private AuthenticationWebFilter bearerAuthenticationFilter(AuthenticationManager authenticationManager) {
        AuthenticationWebFilter bearerAuthenticationFilter = new AuthenticationWebFilter(authenticationManager);
        bearerAuthenticationFilter.setServerAuthenticationConverter(new CookieTokenServerAuthenticationConverter(new JwtHandler(secret)));
        bearerAuthenticationFilter.setRequiresAuthenticationMatcher(ServerWebExchangeMatchers.pathMatchers("/**"));
        return bearerAuthenticationFilter;
    }

    public static class CookieTokenServerAuthenticationConverter implements ServerAuthenticationConverter {

        private final JwtHandler jwtHandler;

        public CookieTokenServerAuthenticationConverter(JwtHandler jwtHandler) {
            this.jwtHandler = jwtHandler;
        }

        @Override
        public Mono<Authentication> convert(ServerWebExchange exchange) {
            return Mono.justOrEmpty(exchange.getRequest().getCookies().getFirst("access_token"))
                    .map(HttpCookie::getValue)
                    .flatMap(token -> jwtHandler.check(token)
                            .flatMap(verificationResult -> {
                                Claims claims = verificationResult.claims;
                                String username = claims.get("username", String.class);
                                String subject = claims.getSubject();
                                Long userId = Long.parseLong(subject);

                                CustomPrincipal principal = new CustomPrincipal(userId, username);

                                return Mono.just((Authentication) new UsernamePasswordAuthenticationToken(principal, null, List.of()));
                            })
                    ).onErrorResume(e -> {
                        log.error("Token validation failed", e);
                        return Mono.empty();
                    });
        }
    }
}
