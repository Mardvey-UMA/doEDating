package ru.app.userservice.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.Interest;

public interface InterestRepository extends R2dbcRepository<Interest, Long> {
    Flux<Interest> findAll();
    Mono<Interest> findById(Long id);
    Mono<Interest> save(Interest interest);
    Mono<Void> deleteById(Long id);
}

