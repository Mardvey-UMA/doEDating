package ru.app.apigateway.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.function.Function;

@RequiredArgsConstructor
@Slf4j
public class BearerTokenServerAuthenticationConverter implements ServerAuthenticationConverter {

    private final JwtHandler jwtHandler;
    private static final String BEARER_PREFIX = "Bearer ";
    private static final Function<String, Mono<String>> getBearerValue =
            authValue -> Mono.justOrEmpty(authValue.substring(BEARER_PREFIX.length()));

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        return extractHeader(exchange)
                .flatMap(getBearerValue)
                .flatMap(jwtHandler::check)
                .flatMap(UserAuthenticationBearer::create)
                .flatMap(auth -> {
                    if (auth != null) {
                        exchange.getResponse().getHeaders().set("X-User-Name",
                                String.valueOf(((CustomPrincipal) auth.getPrincipal()).getName()));
                        exchange.getResponse().getHeaders().set("X-User-ID",
                                String.valueOf(((CustomPrincipal) auth.getPrincipal()).getId()));
                        return Mono.just(auth); // Cast to Authentication
                    } else {
                        return Mono.error(new RuntimeException("Invalid authentication type"));
                    }
                });
    }

    private Mono<String> extractHeader(ServerWebExchange exchange) {
        return Mono.justOrEmpty(exchange.getRequest()
        .getHeaders()
        .getFirst(HttpHeaders.AUTHORIZATION));
    }
}
