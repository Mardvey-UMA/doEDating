package ru.app.apigateway.gateway.filters;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class AddUserIdHeaderGatewayFilterFactory implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
            String nameHeader = exchange.getResponse().getHeaders().getFirst("X-User-Name");
            log.info("X-User-Name: {}", nameHeader);
            if (nameHeader != null) {
                exchange.getRequest().mutate()
                        .header("X-User-Name", nameHeader)
                        .build();
            }

        String idHeader = exchange.getResponse().getHeaders().getFirst("X-User-ID");
        log.info("X-User-ID: {}", idHeader);
        if (idHeader != null) {
            exchange.getRequest().mutate()
                    .header("X-User-ID", idHeader)
                    .build();
        }
            return chain.filter(exchange);
        }
}