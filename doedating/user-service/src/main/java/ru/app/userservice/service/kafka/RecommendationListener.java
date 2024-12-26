package ru.app.userservice.service.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Flux;
import ru.app.userservice.dto.RecommendationResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RecommendationListener {
    private final Logger logger = LoggerFactory.getLogger(RecommendationListener.class);
    // Используем Replay Sink для хранения последних эмитированных данных
    private final Sinks.Many<RecommendationResponseDTO> recommendationsSink = Sinks.many().replay().latest();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "recommendation-response", groupId = "recommendation-group")
    public void listenToKafka(String message) {
        logger.info("Получено сообщение из Kafka: {}", message);

        try {
            RecommendationResponseDTO response = objectMapper.readValue(message, RecommendationResponseDTO.class);
            var result = recommendationsSink.tryEmitNext(response);
            if (result.isFailure()) {
                logger.error("Ошибка при отправке сообщения в поток: {}", result);
            } else {
                logger.info("Сообщение успешно отправлено в поток: {}", response);
            }
        } catch (JsonProcessingException e) {
            logger.error("Ошибка десериализации сообщения: {}", message, e);
        }
    }

    public Flux<RecommendationResponseDTO> getRecommendationsStream(Long userId) {
        return recommendationsSink.asFlux()
                .filter(response -> response.getUserId().equals(userId))
                .doOnSubscribe(subscription -> logger.info("Клиент подписался на поток (рек сервис): {}", userId))
                .doOnCancel(() -> logger.info("Клиент отписался от потока: {}", userId))
                .doOnError(e -> logger.error("Ошибка потока (рек сервис)", e));
    }
}
