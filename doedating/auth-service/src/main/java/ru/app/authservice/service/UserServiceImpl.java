package ru.app.authservice.service;

import org.springframework.kafka.core.KafkaTemplate;
import ru.app.authservice.dto.UserRequestDTO;
import ru.app.authservice.dto.UserResponseDTO;
import ru.app.authservice.entity.User;
import ru.app.authservice.enums.Provider;
import ru.app.authservice.enums.UserRole;
import ru.app.authservice.exception.ApiException;
import ru.app.authservice.mapper.UserMapper;
import ru.app.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import ru.app.authservice.service.kafka.UserProducer;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserProducer userProducer;

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
                .doOnSuccess(userProducer::sendUserToKafka)
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
    public Mono<UserResponseDTO> getByUsername(String username) {
        return userRepository.findByUsername(username).map(userMapper::responseMap);
    }
}