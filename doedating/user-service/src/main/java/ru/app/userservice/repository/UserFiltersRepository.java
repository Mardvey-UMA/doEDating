package ru.app.userservice.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.UserFilters;

public interface UserFiltersRepository extends R2dbcRepository<UserFilters, Long> {
    Mono<UserFilters> findByUserId(Long userId);
}
