package com.example.demo.service;

import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserRequestDTO;
import com.example.demo.enums.Provider;
import com.example.demo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.example.demo.entity.User;
import com.example.demo.enums.UserRole;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

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
        User user = build(userDTO);
        return userRepository.save(user.toBuilder()
                .provider(Provider.PASSWORD)
                .password(passwordEncoder.encode(user.getPassword()))
                .vkId(null)
                .build()
        ).doOnSuccess(u -> log.info("IN create - user: {} created", u)).map(userMapper::responseMap);
    }

    public Mono<UserResponseDTO> createVk(UserRequestDTO userDTO, Long vkId) {
        User user = build(userDTO);
        return userRepository.save(user.toBuilder()
                .provider(Provider.VK)
                .password(null)
                .vkId(vkId)
                .build()
        ).doOnSuccess(u -> log.info("IN createVk - user: {} created", u)).map(userMapper::responseMap);
    }

    private User build (UserRequestDTO userDTO){
        User user = userMapper.requestMap(userDTO);
        return  user.toBuilder()
                .role(UserRole.USER)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public Mono<UserResponseDTO> update(Long id, UserRequestDTO userDTO) {
        return userRepository.findById(id)
                .flatMap(existingUser -> {
                    User updatedUser = existingUser.toBuilder()
                            .username(userDTO.getUsername() != null ? userDTO.getUsername() : existingUser.getUsername())
                            .password(userDTO.getPassword() != null ? userDTO.getPassword() : existingUser.getPassword())
                            .firstName(userDTO.getFirstName() != null ? userDTO.getFirstName() : existingUser.getFirstName())
                            .lastName(userDTO.getLastName() != null ? userDTO.getLastName() : existingUser.getLastName())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    return userRepository.save(updatedUser);
                })
                .map(userMapper::responseMap);
    }

    @Override
    public Mono<UserResponseDTO> getById(Long id) {
        return userRepository
                .findById(id)
                .map(userMapper::responseMap);
    }

    @Override
    public Mono<UserResponseDTO> getByVkId(Long vkId){
        return userRepository
                .findByVkId(vkId)
                .map(userMapper::responseMap);
    }


    @Override
    public Mono<UserResponseDTO> getByUsername(String username) {
        return userRepository
                .findByUsername(username)
                .map(userMapper::responseMap);
    }

    @Override
    public Mono<Void> delete(Long id) {
        return userRepository.deleteById(id);
    }

}
