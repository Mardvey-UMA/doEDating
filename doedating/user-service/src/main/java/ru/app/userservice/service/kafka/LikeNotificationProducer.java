package ru.app.userservice.service.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import ru.app.userservice.dto.UserResponseDTO;
import ru.app.userservice.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LikeNotificationProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    public Mono<Void> sendNotification(Long userId, Long secondUserId, String type) {
        return userRepository.findById(userId).flatMap(user -> userRepository.findById(secondUserId).flatMap(user2 -> {
    Map<String, Object> message = new HashMap<>();
    message.put("chat_id", user.getChatId());
    message.put("type", type);
    message.put("telegram_id", user2.getTelegramId());
    try {
        String jsonPayload = objectMapper.writeValueAsString(message);

        return Mono.fromRunnable(() -> kafkaTemplate.send("user-notifications", jsonPayload));
    } catch (JsonProcessingException e) {
        e.printStackTrace();
        return Mono.error(new RuntimeException("Failed to serialize message to JSON", e));
    }}));}
}
