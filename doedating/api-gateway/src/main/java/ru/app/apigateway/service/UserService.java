package ru.app.apigateway.service;

import ru.app.apigateway.entity.User;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface UserService {
    Mono<User> getById(Long id);
}
