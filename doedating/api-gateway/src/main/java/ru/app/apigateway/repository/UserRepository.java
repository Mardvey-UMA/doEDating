package ru.app.apigateway.repository;

import ru.app.apigateway.entity.User;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
/**
 * Repository interface for managing User entities.
 */
public interface UserRepository extends R2dbcRepository<User, Long> {

}