package ru.app.userservice.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.UserCoordinates;

public interface UserCoordinatesRepository extends R2dbcRepository<UserCoordinates, Long> {
    Mono<UserCoordinates> findByUserId(Long userId);

    Flux<UserCoordinates> findAll();
}
