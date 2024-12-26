package ru.app.userservice.service;

import ru.app.userservice.dto.InterestResponseDTO;
import ru.app.userservice.dto.UserResponseDTO;
import ru.app.userservice.dto.UserRequestDTO;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.UserFilters;

import java.util.List;

@Service
public interface UserService {
    Mono<UserResponseDTO> getById(Long id);
    Mono<UserResponseDTO> findByUsername(String username);
    Flux<UserResponseDTO> getList();
    Mono<UserResponseDTO> update(Long id, UserRequestDTO userDTO);
    Mono<Void> delete(Long id);
    Flux<InterestResponseDTO> getUserInterests(Long userId);
    Mono<UserFilters> getUserFilters(Long userId);
    Mono<UserFilters> updateUserFilters(Long userId, UserFilters filters);
}

