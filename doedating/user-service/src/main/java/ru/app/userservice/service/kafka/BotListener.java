package ru.app.userservice.service.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import ru.app.userservice.repository.UserRepository;
@Service
@RequiredArgsConstructor
@Slf4j
public class BotListener {
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "tgCredentials", groupId = "th_listener_group")
    public void listen(String message) {
        processMessage(message).subscribe();
    }

    private Mono<Void> processMessage(String message) {
        return Mono.defer(() -> {
            try {
                JsonNode jsonNode = objectMapper.readTree(message);

                String telegramId = jsonNode.get("telegram_id").asText();
                String chatId = jsonNode.get("chat_id").asText();

                if (telegramId == null || telegramId.isEmpty()) {
                    log.error("Telegram ID is missing or empty in the Kafka message: {}", message);
                    return Mono.empty();
                }

                return userRepository.findByTelegramId(telegramId)
                        .flatMap(existingUser -> {
                            existingUser.setTelegramId(telegramId);
                            existingUser.setChatId(chatId);

                            return userRepository.save(existingUser).then();
                        });
            } catch (Exception e) {
                log.error("Failed to process Kafka message: {}", e.getMessage());
                return Mono.empty();
            }
        });
    }
}


