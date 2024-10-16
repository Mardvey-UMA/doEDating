package com.example.demo.service;

import com.example.demo.dto.AuthRequestDTO;
import com.example.demo.dto.UserRequestDTO;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.security.JwtHandler;
import com.example.demo.security.SecurityService;
import com.example.demo.websocket.WebSocketController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final UserServiceImpl userService;
    private final SecurityService securityService;
    private final KafkaProducerService kafkaProducerService;
    private final ObjectMapper objectMapper;
    private final JwtHandler jwtHandler;
    private final WebSocketController webSocketController;

    // Обработка публичных топиков
    @KafkaListener(topics = {"register-topic", "user-auth-topic"}, groupId = "group_id", containerFactory = "kafkaListenerContainerFactory")
    public void listenPublicTopics(ConsumerRecord<String, String> record) {
        String topic = record.topic();
        log.info("Received message from {}: {}", topic, record.value());

        switch (topic) {
            case "register-topic" -> processRegister(record.value());
            case "user-auth-topic" -> processUserAuth(record.value());
            default -> log.warn("Unknown public topic: {}", topic);
        }

    }
    @KafkaListener(topics = {"user-get-list-response-topic", "user-get-by-id-response-topic", "user-update-response-topic", "user-delete-response-topic"}, groupId = "group_id")
    public void consumeSecureResponse(ConsumerRecord<String, String> record) {
        log.info("Received secure message from Kafka: {}", record.value());

        try {
            // Разбираем сообщение с sessionId и проверкой токена
            JsonNode messageNode = objectMapper.readTree(record.value());
            String sessionId = messageNode.get("sessionId").asText();
            String responseMessage = messageNode.toString();

            webSocketController.sendMessageToWebSocket(sessionId, responseMessage);

        } catch (Exception e) {
            log.error("Failed to process secure message from topic {}: {}", record.topic(), e.getMessage(), e);
        }
    }
    public Mono<Void> sendRegisterResponse(String sessionId, String jsonResponse) {
        try {
            String enrichedResponse = objectMapper.writeValueAsString(Map.of(
                    "sessionId", sessionId,
                    "topic", "register-response-topic",
                    "data", objectMapper.readValue(jsonResponse, Map.class)
            ));
            return kafkaProducerService.sendMessage("register-response-topic", enrichedResponse);
        } catch (JsonProcessingException e) {
            log.error("Failed to process response for registration", e);
            return Mono.error(e);
        }
    }


    public Mono<Void> sendAuthResponse(String sessionId, String jsonResponse) {
        try {
            String enrichedResponse = objectMapper.writeValueAsString(Map.of(
                    "sessionId", sessionId,
                    "topic", "user-auth-response-topic",
                    "data", objectMapper.readValue(jsonResponse, Map.class) // Обрабатываем только данные
            ));
            return kafkaProducerService.sendMessage("user-auth-response-topic", enrichedResponse);
        } catch (JsonProcessingException e) {
            log.error("Failed to process response for authentication", e);
            return Mono.error(e);
        }
    }
    @KafkaListener(topics = {"register-response-topic", "user-auth-response-topic"}, groupId = "group_id")
    public void consumeResponse(ConsumerRecord<String, String> record) {
        log.info("Received message from Kafka: {}", record.value());

        try {

            JsonNode messageNode = objectMapper.readTree(record.value());
            String sessionId = messageNode.get("sessionId").asText();
            String responseMessage = messageNode.toString();

            webSocketController.sendMessageToWebSocket(sessionId, responseMessage);
        } catch (Exception e) {
            log.error("Failed to process message from topic {}: {}", record.topic(), e.getMessage(), e);
        }
    }


    @KafkaListener(topics = {"user-get-list-topic", "user-get-by-id-topic", "user-update-topic", "user-delete-topic"}, groupId = "group_id", containerFactory = "kafkaListenerContainerFactory")
    public void listenSecureTopics(ConsumerRecord<String, String> record,
                                   @Header("Authorization") String authorizationHeader) {
        String topic = record.topic();
        log.info("Received message from {}: {}", topic, record.value());

        validateToken(authorizationHeader) // Проверка токена
                .then(processSecureMessage(record))
                .doOnError(e -> log.error("Error processing secure message: {}", e.getMessage()))
                .subscribe();
    }

    private Mono<Void> processSecureMessage(ConsumerRecord<String, String> record) {
        return switch (record.topic()) {
            case "user-get-list-topic" -> parseJson(record.value(), JsonNode.class)
                    .flatMap(jsonNode -> {
                        String sessionId = extractSessionId(jsonNode);
                        return userService.getList()
                                .collectList()
                                .flatMap(users -> sendResponseWithSessionId("user-get-list-response-topic", sessionId, users))
                                .then();
                    });

            case "user-get-by-id-topic" -> parseJson(record.value(), JsonNode.class)
                    .flatMap(jsonNode -> {
                        String sessionId = extractSessionId(jsonNode);
                        if (!jsonNode.has("data") || !jsonNode.get("data").has("id")) {
                            return Mono.error(new IllegalArgumentException("User ID is missing in message body"));
                        }
                        Long userId = jsonNode.get("data").get("id").asLong();
                        return userService.getById(userId)
                                .flatMap(user -> sendResponseWithSessionId("user-get-by-id-response-topic", sessionId, user))
                                .then();
                    });

            case "user-update-topic" -> parseJson(record.value(), JsonNode.class)
                    .flatMap(jsonNode -> {
                        String sessionId = extractSessionId(jsonNode);
                        UserRequestDTO userDTO = parseUserRequestDTO(jsonNode.get("data"));
                        if (userDTO.getId() == null) {
                            return Mono.error(new IllegalArgumentException("User ID is missing in message body"));
                        }
                        return userService.update(userDTO.getId(), userDTO)
                                .flatMap(updatedUser -> sendResponseWithSessionId("user-update-response-topic", sessionId, "Update successful"))
                                .then();
                    });

            case "user-delete-topic" -> parseJson(record.value(), JsonNode.class)
                    .flatMap(jsonNode -> {
                        String sessionId = extractSessionId(jsonNode);
                        if (!jsonNode.has("data") || !jsonNode.get("data").has("id")) {
                            return Mono.error(new IllegalArgumentException("User ID is missing in message body"));
                        }
                        Long deleteId = jsonNode.get("data").get("id").asLong();
                        return userService.delete(deleteId)
                                .then(sendResponseWithSessionId("user-delete-response-topic", sessionId, "Delete successful"));
                    });

            default -> {
                log.warn("Unknown secure topic: {}", record.topic());
                yield Mono.empty();
            }
        };
    }


    private String extractSessionId(JsonNode jsonNode) {
        if (!jsonNode.has("sessionId")) {
            throw new IllegalArgumentException("Session ID is missing in message");
        }
        return jsonNode.get("sessionId").asText();
    }

    private Mono<Void> sendResponseWithSessionId(String responseTopic, String sessionId, Object responseData) {
        return serializeToJson(responseData)
                .flatMap(jsonResponse -> {
                    String enrichedResponse = null;
                    try {
                        enrichedResponse = objectMapper.createObjectNode()
                                .put("sessionId", sessionId)
                                .put("topic", responseTopic)
                                .set("data", objectMapper.readTree(jsonResponse))
                                .toString();
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                    return kafkaProducerService.sendMessage(responseTopic, enrichedResponse);
                });
    }




    private void processRegister(String message) {
        try {
            JsonNode messageNode = objectMapper.readTree(message);
            String sessionId = messageNode.get("sessionId").asText();
            JsonNode userData = messageNode.get("data");

            Mono.just(userData.toString())
                    .flatMap(json -> parseJson(json, UserRequestDTO.class))
                    .flatMap(userService::create)
                    .flatMap(this::serializeToJson)
                    .flatMap(response -> sendRegisterResponse(sessionId, response))
                    .doOnError(error -> {
                        log.error("Failed to process registration", error);
                        sendRegisterResponse(sessionId, "{\"error\": \"Registration failed: " + error.getMessage() + "\"}").subscribe();
                    })
                    .subscribe();
        } catch (JsonProcessingException e) {
            log.error("Failed to extract sessionId", e);
        }
    }

    private void processUserAuth(String message) {
        try {
            JsonNode messageNode = objectMapper.readTree(message);
            String sessionId = messageNode.get("sessionId").asText();
            JsonNode authData = messageNode.get("data");

            Mono.just(authData.toString())
                    .flatMap(json -> parseJson(json, AuthRequestDTO.class))
                    .flatMap(securityService::login)
                    .flatMap(this::serializeToJson)
                    .flatMap(response -> sendAuthResponse(sessionId, response))
                    .doOnError(error -> {
                        log.error("Failed to process authentication", error);
                        sendAuthResponse(sessionId, "{\"error\": \"Authentication failed: " + error.getMessage() + "\"}").subscribe();
                    })
                    .subscribe();
        } catch (JsonProcessingException e) {
            log.error("Failed to extract sessionId", e);
        }
    }

    // Слушаем response топики чтобы прокинуть ответку
    @KafkaListener(topics = {"user-get-list-response-topic", "user-get-by-id-response-topic", "user-update-response-topic", "user-delete-response-topic"}, groupId = "group_id")
    public void listenSecureTopics(ConsumerRecord<String, String> record) {
        String topic = record.topic();
        log.info("Received message from {}: {}", topic, record.value());

        switch (topic) {
            case "user-get-list-response-topic" -> processUserList(record.value());
            case "user-get-by-id-response-topic" -> processUserById(record.value());
            case "user-update-response-topic" -> processUserUpdate(record.value());
            case "user-delete-response-topic" -> processUserDelete(record.value());
            default -> log.warn("Unknown topic: {}", topic);
        }
    }
// Получить список пользователей и отправка в вебсокет
    private void processUserList(String message) {
        try {
            JsonNode messageNode = objectMapper.readTree(message);
            String sessionId = messageNode.get("sessionId").asText();
            JsonNode userData = messageNode.get("data");

            String responseMessage = objectMapper.createObjectNode()
                    .put("topic", "user-get-list-response-topic")
                    .set("data", userData)
                    .toString();

            webSocketController.sendMessageToWebSocket(sessionId, responseMessage);
        } catch (Exception e) {
            log.error("Failed to process user list: {}", message, e);
        }
    }
// Найти юзера по id и отправка в вебсокет
    private void processUserById(String message) {
        try {
            JsonNode messageNode = objectMapper.readTree(message);
            String sessionId = messageNode.get("sessionId").asText();
            JsonNode userData = messageNode.get("data");

            String responseMessage = objectMapper.createObjectNode()
                    .put("topic", "user-get-by-id-response-topic")
                    .set("data", userData)
                    .toString();

            webSocketController.sendMessageToWebSocket(sessionId, responseMessage);
        } catch (Exception e) {
            log.error("Failed to process user by ID: {}", message, e);
        }
    }
// Обновление пользователя и отправка в вебсокет
    private void processUserUpdate(String message) {
        try {
            JsonNode messageNode = objectMapper.readTree(message);
            String sessionId = messageNode.get("sessionId").asText();
            JsonNode updateData = messageNode.get("data");

            String responseMessage = objectMapper.createObjectNode()
                    .put("topic", "user-update-response-topic")
                    .set("data", updateData)
                    .toString();

            webSocketController.sendMessageToWebSocket(sessionId, responseMessage);
        } catch (Exception e) {
            log.error("Failed to process user update: {}", message, e);
        }
    }
//Удаление пользователя и отправка в вебсокет
    private void processUserDelete(String message) {
        try {
            JsonNode messageNode = objectMapper.readTree(message);
            String sessionId = messageNode.get("sessionId").asText();

            String responseMessage = objectMapper.createObjectNode()
                    .put("topic", "user-delete-response-topic")
                    .put("message", "User deleted successfully")
                    .toString();

            webSocketController.sendMessageToWebSocket(sessionId, responseMessage);
        } catch (Exception e) {
            log.error("Failed to process user deletion: {}", message, e);
        }
    }

    //----------------------------------------------ПРОЧЕЕ-----------------------------------------------------
    private UserRequestDTO parseUserRequestDTO(JsonNode jsonData) {
        try {
            return objectMapper.treeToValue(jsonData, UserRequestDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse UserRequestDTO", e);
        }
    }

    private Mono<Void> validateToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return Mono.error(new RuntimeException("Authorization header missing or invalid"));
        }
        String token = authorizationHeader.substring(7);
        return jwtHandler.check(token)
                .doOnError(e -> log.error("Invalid token: {}", e.getMessage()))
                .then();
    }

    private <T> Mono<T> parseJson(String json, Class<T> clazz) {
        try {
            return Mono.just(objectMapper.readValue(json, clazz));
        } catch (JsonProcessingException e) {
            log.error("Failed to parse JSON: {}", json, e);
            return Mono.error(e);
        }
    }

    private Mono<String> serializeToJson(Object object) {
        try {
            return Mono.just(objectMapper.writeValueAsString(object));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize object to JSON: {}", object, e);
            return Mono.error(e); // Возвращаем ошибку в реактивном потоке
        }
    }
}
