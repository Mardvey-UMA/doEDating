package ru.app.userservice.service.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendationProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public Mono<Void> sendCalculateStart(Long userId) {
        Map<String, Object> message = new HashMap<>();
        message.put("user_id", userId);
        message.put("status", "start");

        try {
            String jsonPayload = objectMapper.writeValueAsString(message);

            return Mono.fromRunnable(() -> kafkaTemplate.send("start-calculate-recommendation", jsonPayload));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return Mono.error(new RuntimeException("Failed to serialize message to JSON", e));
        }
    }
}

