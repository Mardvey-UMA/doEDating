package ru.app.authservice.service.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import ru.app.authservice.dto.UserResponseDTO;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public UserProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendUserToKafka(UserResponseDTO userResponseDTO) {
        Map<String, Object> message = new HashMap<>();
        message.put("payload", userResponseDTO);
        kafkaTemplate.send("auth_users", message);
    }
}

