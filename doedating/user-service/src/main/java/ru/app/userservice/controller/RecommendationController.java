package ru.app.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.dto.RecommendationResponseDTO;
import ru.app.userservice.service.RecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendation")
public class RecommendationController {
    private final Logger logger = LoggerFactory.getLogger(RecommendationController.class);
    private final RecommendationService recommendationService;

    @PostMapping()
    public Mono<Void> postRecommendation(@RequestHeader(value = "X-User-ID", required = true) Long userId) {
        logger.info("Запуск расчёта рекомендаций для пользователя: {}", userId);
        return recommendationService.startCalculation(userId)
                .doOnSuccess(unused -> logger.info("Запрос на расчёт отправлен для пользователя: {}", userId))
                .doOnError(error -> logger.error("Ошибка при запуске расчёта для пользователя: {}", userId, error));
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<RecommendationResponseDTO> streamRecommendations(@RequestHeader(value = "X-User-ID", required = true) Long userId) {
        logger.info("Подписка на SSE-поток рекомендаций для пользователя: {}", userId);
        return recommendationService.getRecommendationStream(userId)
                .doOnSubscribe(subscription -> logger.info("Клиент подписался на поток: {}", userId))
                .doOnCancel(() -> logger.info("Клиент отписался от потока: {}", userId))
                .doOnError(e -> logger.error("Ошибка при передаче данных SSE для пользователя: {}", userId, e));
    }
}
