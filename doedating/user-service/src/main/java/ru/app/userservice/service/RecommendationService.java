package ru.app.userservice.service;

import ch.qos.logback.classic.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.dto.RecommendationResponseDTO;
import ru.app.userservice.dto.UserResponseDTO;
import ru.app.userservice.service.kafka.RecommendationListener;
import ru.app.userservice.service.kafka.RecommendationProducer;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationProducer recommendationProducer;

    private final RecommendationListener recommendationListener;

    public Flux<RecommendationResponseDTO> getRecommendationStream(Long userId) {
        return recommendationListener.getRecommendationsStream(userId);
    }
    public Mono<Void> startCalculation(Long userId) {
        return recommendationProducer.sendCalculateStart(userId);
    }

}

