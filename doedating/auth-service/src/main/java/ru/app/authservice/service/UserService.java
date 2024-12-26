package ru.app.authservice.service;

import ru.app.authservice.dto.UserRequestDTO;
import ru.app.authservice.dto.UserResponseDTO;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface UserService {
    Mono<UserResponseDTO> getByUsername(String username);
    Mono<UserResponseDTO> create(UserRequestDTO userDTO);
    Mono<UserResponseDTO> createVk(UserRequestDTO userDTO, Long vkId);

}
