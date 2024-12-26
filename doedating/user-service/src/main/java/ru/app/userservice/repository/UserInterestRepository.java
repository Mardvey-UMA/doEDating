package ru.app.userservice.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.UserInterest;

public interface UserInterestRepository extends R2dbcRepository<UserInterest, Long> {
    Flux<UserInterest> findByUserId(Long userId);
    Mono<Void> deleteByUserId(Long userId);
}

