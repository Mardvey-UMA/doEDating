package com.example.demo.service;

import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserRequestDTO;
import com.example.demo.enums.Provider;
import com.example.demo.exception.ApiException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.security.CustomPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.example.demo.entity.User;
import com.example.demo.enums.UserRole;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public Flux<UserResponseDTO> getList() {
        return userRepository.findAll()
                .map(userMapper::responseMap);
    }

    @Override
    public Mono<UserResponseDTO> create(UserRequestDTO userDTO) {
        return saveUser(userDTO, Provider.PASSWORD, null);
    }

    @Override
    public Mono<UserResponseDTO> createVk(UserRequestDTO userDTO, Long vkId) {
        return saveUser(userDTO, Provider.VK, vkId);
    }

    private Mono<UserResponseDTO> saveUser(UserRequestDTO userDTO, Provider provider, Long vkId) {
        User user = build(userDTO);
        User newUser = user.toBuilder()
                .provider(provider)
                .password(provider == Provider.PASSWORD ? passwordEncoder.encode(user.getPassword()) : null)
                .vkId(vkId)
                .build();

        return userRepository.save(newUser)
                .doOnSuccess(u -> log.info("IN create - user: {} created", u))
                .map(userMapper::responseMap)
                .doOnError(throwable -> log.error("Error creating user: {}", throwable.getMessage()))
                .onErrorMap(e -> new ApiException("Username already exists", "INVALID_USERNAME"));
    }

    private User build(UserRequestDTO userDTO) {
        return userMapper.requestMap(userDTO).toBuilder()
                .role(UserRole.USER)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public Mono<UserResponseDTO> update(Long id, UserRequestDTO userDTO) {
        return userRepository.findById(id)
                .flatMap(existingUser -> updateExistingUser(existingUser, userDTO))
                .map(userMapper::responseMap);
    }

    private Mono<User> updateExistingUser(User existingUser, UserRequestDTO userDTO) {
        User updatedUser = existingUser.toBuilder()
                .username(Optional.ofNullable(userDTO.getUsername()).orElse(existingUser.getUsername()))
                .password(Optional.ofNullable(userDTO.getPassword()).orElse(existingUser.getPassword()))
                .firstName(Optional.ofNullable(userDTO.getFirstName()).orElse(existingUser.getFirstName()))
                .lastName(Optional.ofNullable(userDTO.getLastName()).orElse(existingUser.getLastName()))
                .updatedAt(LocalDateTime.now())
                .build();

        return userRepository.save(updatedUser);
    }

    @Override
    public Mono<UserResponseDTO> getById(Long id) {
        return findById(id);
    }

    @Override
    public Mono<UserResponseDTO> getByUsername(String username) {
        return findByUsername(username);
    }

    private Mono<UserResponseDTO> findById(Long id) {
        return userRepository.findById(id).map(userMapper::responseMap);
    }

    private Mono<UserResponseDTO> findByUsername(String username) {
        return userRepository.findByUsername(username).map(userMapper::responseMap);
    }

    @Override
    public Mono<Void> delete(Long id) {
        return userRepository.deleteById(id);
    }

    @Override
    public Mono<UserResponseDTO> getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) return Mono.empty();

        return getById( ((CustomPrincipal) authentication.getPrincipal()).getId());
    }
}