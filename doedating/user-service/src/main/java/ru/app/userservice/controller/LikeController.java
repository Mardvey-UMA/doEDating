package ru.app.userservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import ru.app.userservice.entity.Like;
import ru.app.userservice.service.LikeServiceImpl;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {
    private final LikeServiceImpl likeService;
    @PostMapping()
    public Mono<Void> likeUser(
            @RequestHeader(value = "X-User-ID", required = false)
            Long userId,
            @RequestParam
            Long targetUserId,
            @RequestParam
            Integer typeOfLike
    ) {
        return likeService.likeUser(userId, targetUserId, typeOfLike);
    }

    @Operation(
            summary = "Получить все лайки, поставленные данному пользователю",
            description = "Возвращает все лайки поставленные пользователю")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Like> getAllLikes(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        return likeService.getListBySecondUserId(userId);
    }

    @Operation(
            summary = "Получить все лайки, поставленные данным пользователем",
            description = "Возвращает все лайки поставленные данным пользователем")
    @GetMapping(value = "/myLikes", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Like> getAllMyLikes(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        return likeService.getListByFirstUserId(userId);
    }

}
