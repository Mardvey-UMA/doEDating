package ru.app.userservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.Like;
import ru.app.userservice.entity.Match;
import ru.app.userservice.repository.LikeRepository;
import ru.app.userservice.repository.MatchRepository;
import ru.app.userservice.service.kafka.LikeNotificationProducer;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeServiceImpl {
    private final LikeRepository likeRepository;
    private final MatchRepository matchRepository;
    private final LikeNotificationProducer likeNotificationProducer;

    public Mono<Void> likeUser(Long firstUserId, Long secondUserId, Integer typeOfLike) {

        return likeRepository.findByFirstUserIdAndSecondUserId(firstUserId, secondUserId)
                .flatMap(existingLike -> {
                    return Mono.error(new IllegalStateException("Уже есть лайк"));
                })
                .switchIfEmpty(Mono.defer(() -> {
                    Like like = Like.builder()
                            .firstUserId(firstUserId)
                            .secondUserId(secondUserId)
                            .typeOfLike(typeOfLike)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return likeRepository.save(like);
                }))
                .then(checkMatch(firstUserId, secondUserId, typeOfLike))
//                .then(sendNotificationIfNecessary(secondUserId, typeOfLike))
                .doOnError(e -> log.error("Ошибка с лайком", e))
                .then(Mono.empty());
    }

    private Mono<Void> checkMatch(Long firstUserId, Long secondUserId, Integer typeOfLike) {
        return likeRepository.findByFirstUserIdAndSecondUserId(secondUserId, firstUserId)
                .flatMap(otherLike -> {
                    if (otherLike.getTypeOfLike() == 1 || otherLike.getTypeOfLike() == 2) {
                        // Создание матча
                        Match match = Match.builder()
                                .userId1(Math.min(firstUserId, secondUserId))
                                .userId2(Math.max(firstUserId, secondUserId))
                                .createdAt(LocalDateTime.now())
                                .build();

                        // Сохранение матча и отправка уведомлений
                        return matchRepository.save(match)
                                .then(likeNotificationProducer.sendNotification(firstUserId, secondUserId, "match"))
                                .then(likeNotificationProducer.sendNotification(secondUserId, firstUserId, "match"));
                    } else {
                        // Если условие не срабатывает, возвращаем Mono.empty()
                        return Mono.empty();
                    }
                })
                .switchIfEmpty(
                        // Этот блок сработает только если матч не был сохранён и уведомления не были отправлены
                        sendNotificationIfNecessary(secondUserId, typeOfLike)
                );
    }


    private Mono<Void> sendNotificationIfNecessary(Long secondUserId, Integer typeOfLike) {
        if (typeOfLike != 1) {
            return Mono.empty();
        }
        return likeNotificationProducer.sendNotification(secondUserId, secondUserId,"like");
    }

    public Flux<Like> getListBySecondUserId(Long userId) {
        return likeRepository.findAllBySecondUserId(userId);
    }

    public Flux<Like> getListByFirstUserId(Long userId) {
        return likeRepository.findAllByFirstUserId(userId);
    }
}
