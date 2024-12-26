package ru.app.userservice.service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class PhotoProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendPhotoForFaceCheck(String photoId, String encodedImage) {
        Map<String, String> message = new HashMap<>();
        message.put("photo_id", photoId);
        message.put("image_data", encodedImage);

        try {
            String jsonPayload = objectMapper.writeValueAsString(message);
            kafkaTemplate.send("check-photo-face", photoId, jsonPayload);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send message to Kafka", e);
        }
    }
}
