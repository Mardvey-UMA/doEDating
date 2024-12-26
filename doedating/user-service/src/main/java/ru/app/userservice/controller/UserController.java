package ru.app.userservice.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import ru.app.userservice.dto.InterestResponseDTO;
import ru.app.userservice.dto.UserRequestDTO;
import ru.app.userservice.dto.UserResponseDTO;
import ru.app.userservice.entity.UserFilters;
import ru.app.userservice.service.UserPhotoService;
import ru.app.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserPhotoService userPhotoService;

    @Operation(
            summary = "Получить всех пользователей",
            description = "Возвращает список всех пользователей.")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<UserResponseDTO> getAllUsers() {
        return userService.getList();
    }

    @Operation(
            summary = "Получить пользователя по ID",
            description = "Возвращает пользователя с указанным ID.")
    @GetMapping(
            value = "/info/{userId}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<UserResponseDTO> getUserInfoPath(@PathVariable Long userId) {
        return userService.getById(userId);
    }

    @Operation(
            summary = "Получить инфомацию о своем пользователе",
            description = "Возвращает пользователя с указанным ID.")
    @GetMapping(
            value = "/info",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<UserResponseDTO> getUserInfo(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        return userService.getById(userId);
    }

    @Operation(
            summary = "Удалить пользователя",
            description = "Удаляет пользователя с указанным ID.")
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteUser(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        return userService.delete(userId);
    }

    @Operation(
            summary = "Обновить данные пользователя",
            description = "Обновляет данные пользователя с указанным ID.")
    @PatchMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<UserResponseDTO> updateUser(
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @RequestBody UserRequestDTO userDTO) {
        return userService.update(userId, userDTO);
    }

    // ИНТЕРЕСЫ

    @Operation(
            summary = "Получить список интересов пользователя",
            description = "Возвращает список интересов пользователя с полной информацией.")
    @GetMapping("/interests")
    public Flux<InterestResponseDTO> getUserInterests(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        return userService.getUserInterests(userId);
    }
    @Operation(
            summary = "Получить список интересов пользователя",
            description = "Возвращает список интересов пользователя с полной информацией.")
    @GetMapping("/interests/{userId}")
    public Flux<InterestResponseDTO> getUserInterestsPath(@PathVariable Long userId) {
        return userService.getUserInterests(userId);
    }

    // ФОТОГРАФИИ

    @PostMapping("/photo")
    public Mono<ResponseEntity<Map<String, Object>>> uploadUserPhoto(
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @RequestPart("file") FilePart filePart) {
        return userPhotoService.processUserPhoto(userId, filePart)
                .map(response -> ResponseEntity.ok().body(response))
                .onErrorResume(e -> {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("error", e.getMessage());
                    return Mono.just(ResponseEntity.badRequest().body(errorResponse));
                });
    }

    @GetMapping("/{userId}/photo/{filename}")
    public Mono<ResponseEntity<Resource>> getUserPhotoPath(
            @PathVariable Long userId,
            @PathVariable String filename) {
        return userPhotoService.loadUserPhoto(userId, filename)
                .map(resource -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource));
    }

    @GetMapping("/photo/{filename}")
    public Mono<ResponseEntity<Resource>> getUserPhoto(
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @PathVariable String filename) {
        return userPhotoService.loadUserPhoto(userId, filename)
                .map(resource -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource));
    }

    @DeleteMapping("/photo/{filename}")
    public Mono<ResponseEntity<Void>> deleteUserPhoto(
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @PathVariable String filename) {
        return userPhotoService.deleteUserPhoto(userId, filename)
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    // ФИЛЬТРЫ

    @Operation(
            summary = "Получить фильтры пользователя",
            description = "Возвращает фильтры пользователя по его ID.")
    @GetMapping("/filters")
    public Mono<UserFilters> getUserFilters(@RequestHeader(value = "X-User-ID", required = false) Long userId) {
        return userService.getUserFilters(userId);
    }

    @Operation(
            summary = "Обновить фильтры пользователя",
            description = "Изменяет фильтры пользователя по его ID.")
    @PatchMapping("/filters")
    @ResponseStatus(HttpStatus.OK)
    public Mono<UserFilters> updateUserFilters(
            @RequestHeader(value = "X-User-ID", required = false) Long userId,
            @RequestBody UserFilters filters) {
        return userService.updateUserFilters(userId, filters);
    }

}
