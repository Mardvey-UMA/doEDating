package ru.app.userservice.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.Photo;

public interface PhotoRepository extends R2dbcRepository<Photo, Long> {
    Flux<Photo> findByUserId(Long userId);
    Mono<Void> deleteByUserId(Long userId);
}
