package ru.app.userservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import ru.app.userservice.entity.Match;
import ru.app.userservice.service.MatchServiceImpl;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/matches")
public class MatchController {
    private final MatchServiceImpl matchService;

//    @Operation(
//            summary = "Получить все мэтчи",
//            description = "Возвращает списокмэтчей.")
//    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
//    public Flux<Match> getAllMatches() {
//        return matchService.getList();
//    }

    @Operation(
            summary = "Получить все мэтчи пользователя.",
            description = "Возвращает список мэтчей пользователя по id.")
    @GetMapping(value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Match> getAllMatchesById(@PathVariable Long userId) {
        return matchService.getListById(userId);
    }

    @Operation(
            summary = "Получить все мэтчи авторизованного пользователя.",
            description = "Возвращает список мэтчей авторизованного пользователя.")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Match> getAllMatchesByHeader(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        return matchService.getListById(userId);
    }

}
