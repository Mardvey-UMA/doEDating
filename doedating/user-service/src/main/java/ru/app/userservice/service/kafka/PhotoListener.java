package ru.app.userservice.service.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PhotoListener {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Sinks.One<Map<String, Object>>> responseSinks = new ConcurrentHashMap<>();

    public Mono<Map<String, Object>> getFaceDetectionResponse(String photoId) {
        Sinks.One<Map<String, Object>> sink = Sinks.one();
        responseSinks.put(photoId, sink);
        return sink.asMono();
    }

    @KafkaListener(topics = "face-check-response", groupId = "face-detection-service")
    public void consumeFaceCheckResponse(String message) {
        Map<String, Object> response = parseMessage(message);
        String photoId = (String) response.get("photo_id");

        Sinks.One<Map<String, Object>> sink = responseSinks.remove(photoId);
        if (sink != null) {
            sink.tryEmitValue(response);
        }
    }

    private Map<String, Object> parseMessage(String message) {
        try {
            return objectMapper.readValue(message, Map.class);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка", e);
        }
    }
}
