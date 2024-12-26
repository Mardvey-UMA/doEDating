package ru.app.authservice.repository;

import ru.app.authservice.entity.User;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;

/**
 * Repository interface for managing User entities.
 */
public interface UserRepository extends R2dbcRepository<User, Long> {

    /**
     * Finds a user by their username.
     *
     * @param username the username of the user
     * @return a Mono containing the User if found, otherwise empty
     */
    Mono<User> findByUsername(String username);

    /**
     * Finds a user by their VK ID.
     *
     * @param vkId the VK ID of the user
     * @return a Mono containing the User if found, otherwise empty
     */
    Mono<User> findByVkId(Long vkId);


}