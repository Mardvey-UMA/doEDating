package com.example.demo.service;

import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserRequestDTO;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public interface UserService {
    Mono<UserResponseDTO> getById(Long id);
    Mono<UserResponseDTO> getByUsername(String username);
    Mono<UserResponseDTO> getByVkId(Long vkId);
    Flux<UserResponseDTO> getList();
    Mono<UserResponseDTO> create(UserRequestDTO userDTO);
    Mono<UserResponseDTO> createVk(UserRequestDTO userDTO, Long vkId);
    Mono<UserResponseDTO> update(Long id, UserRequestDTO userDTO);
    Mono<Void> delete(Long id);
}
