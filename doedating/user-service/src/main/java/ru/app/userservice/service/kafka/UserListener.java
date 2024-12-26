package ru.app.userservice.service.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.User;
import ru.app.userservice.entity.UserFilters;
import ru.app.userservice.enums.Provider;
import ru.app.userservice.enums.Theme;
import ru.app.userservice.enums.UserRole;
import ru.app.userservice.repository.UserRepository;
import ru.app.userservice.repository.UserFiltersRepository;
@Service
@RequiredArgsConstructor
@Slf4j
public class UserListener {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserFiltersRepository userFiltersRepository;
    @KafkaListener(topics = "auth_users", groupId = "user_group")
    public void listen(String message) {
        processMessage(message).subscribe();
    }

    private Mono<Void> processMessage(String message) {
        return Mono.defer(() -> {
            try {
                JsonNode jsonNode = objectMapper.readTree(message);
                JsonNode payloadNode = jsonNode.get("payload");

                if (payloadNode == null) {
                    log.error("Payload is missing in the Kafka message: {}", message);
                    return Mono.empty();
                }

                String username = payloadNode.get("username").asText();
                Provider provider = Provider.valueOf(payloadNode.get("provider").asText());
                UserRole role = UserRole.valueOf(payloadNode.get("role").asText());

                Long vkId = payloadNode.has("vk_id") && !payloadNode.get("vk_id").isNull() ? payloadNode.get("vk_id").asLong() : null;
                boolean enabled = !payloadNode.has("enabled") || payloadNode.get("enabled").asBoolean();
                String firstName = payloadNode.has("first_name") && !payloadNode.get("first_name").isNull()
                        ? payloadNode.get("first_name").asText() : null;
                String lastName = payloadNode.has("last_name") && !payloadNode.get("last_name").isNull()
                        ? payloadNode.get("last_name").asText() : null;

                return userRepository.findByUsername(username)
                        .flatMap(existingUser -> {
                            existingUser.setProvider(provider);
                            existingUser.setVkId(vkId);
                            existingUser.setRole(role);
                            existingUser.setEnabled(enabled);
                            existingUser.setFirstName(firstName);
                            existingUser.setLastName(lastName);
                            return userRepository.save(existingUser).then();
                        })
                        .switchIfEmpty(Mono.defer(() -> {
                            User newUser = User.builder()
                                    .username(username)
                                    .provider(provider)
                                    .vkId(vkId)
                                    .role(role)
                                    .enabled(enabled)
                                    .firstName(firstName)
                                    .lastName(lastName)
                                    .theme(Theme.light)
                                    .build();

                            return userRepository.save(newUser)
                                    .flatMap(savedUser -> {
                                        UserFilters filters = UserFilters.builder()
                                                .userId(savedUser.getId())
                                                .build();
                                        return userFiltersRepository.save(filters)
                                                .doOnSuccess(savedFilters -> log.info("Filters created for user ID: {}", savedUser.getId()))
                                                .then();
                                    })
                                    .doOnSuccess(savedUser -> log.info("User created: {}", savedUser));
                        }));
            } catch (Exception e) {
                log.error("Failed to process Kafka message: {}", e.getMessage());
                return Mono.empty();
            }
        });
    }
}
