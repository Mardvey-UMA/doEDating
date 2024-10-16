package com.example.demo.websocket;

import com.example.demo.service.KafkaProducerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketController implements WebSocketHandler {

    private final ObjectMapper objectMapper;
    private final KafkaProducerService kafkaProducerService;

    private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public WebSocketController(ObjectMapper objectMapper, KafkaProducerService kafkaProducerService) {
        this.objectMapper = objectMapper;
        this.kafkaProducerService = kafkaProducerService;
    }

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        sessions.put(session.getId(), session);

        return session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .flatMap(payload -> {
                    try {
                        Map<String, Object> messageMap = objectMapper.readValue(payload, Map.class);
                        String topic = (String) messageMap.get("topic");
                        String accessToken = (String) messageMap.get("accessToken");  // Можем получить null, если токен отсутствует
                        Object data = messageMap.get("data");

                        log.info("Отправка в Kafka сессия: {}, токен: {}, данные: {}", session.getId(), accessToken, data);

                        // Формирование сообщения для Kafka с sessionId и данными
                        Map<String, Object> kafkaMessage = Map.of(
                                "sessionId", session.getId(),
                                "data", data  // данные пользователя
                        );

                        String kafkaPayload = objectMapper.writeValueAsString(kafkaMessage);

                        // Если accessToken есть, используем метод с токеном, иначе обычный метод
                        if (accessToken != null && !accessToken.isBlank()) {
                            return kafkaProducerService.sendMessageWithToken(topic, kafkaPayload, accessToken);
                        } else {
                            return kafkaProducerService.sendMessage(topic, kafkaPayload);
                        }
                    } catch (Exception e) {
                        log.error("Неверный формат данных: {}", payload, e);
                        return Mono.empty();
                    }
                })
                .doFinally(signalType -> sessions.remove(session.getId()))
                .then();
    }




    // Метод для отправки сообщений в WebSocket сессии
    public void sendMessageToWebSocket(String sessionId, String message) {
        WebSocketSession session = sessions.get(sessionId);
        if (session != null && session.isOpen()) {
            session.send(Mono.just(session.textMessage(message))).subscribe();
        } else {
            log.warn("Session {} is not active", sessionId);
        }
    }
}
