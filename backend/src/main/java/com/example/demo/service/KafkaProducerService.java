package com.example.demo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public Mono<Void> sendMessage(String topic, String jsonMessage) {
        log.info("Sending message to topic {}: {}", topic, jsonMessage);

        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(topic, jsonMessage);

        return Mono.create(sink -> future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Message sent successfully to topic: {}", topic);
                sink.success();
            } else {
                log.error("Failed to send message to topic: {}", topic, ex);
                sink.error(ex);
            }
        }));
    }

    //метод для отправки сообщений с токеном в заголовке
    public Mono<Void> sendMessageWithToken(String topic, String jsonMessage, String accessToken) {
        log.info("Sending message with token to topic {}: {}", topic, jsonMessage);

        ProducerRecord<String, String> record = new ProducerRecord<>(topic, jsonMessage);

        record.headers().add(new RecordHeader("Authorization", ("Bearer " + accessToken).getBytes(StandardCharsets.UTF_8)));

        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(record);

        return Mono.create(sink -> future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Message with token sent successfully to topic: {}", topic);
                sink.success();
            } else {
                log.error("Failed to send message with token to topic: {}", topic, ex);
                sink.error(ex);
            }
        }));
    }
}
