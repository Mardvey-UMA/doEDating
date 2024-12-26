package ru.app.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import ru.app.userservice.service.kafka.PhotoListener;
import ru.app.userservice.service.kafka.PhotoProducer;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;

@RequiredArgsConstructor
@Service
    public class UserPhotoService {
        @Value("${photo.storage.path}")
        private String photoStoragePath;

        private final PhotoProducer photoProducer;
        private final PhotoListener photoListener;

    public Mono<Map<String, Object>> processUserPhoto(Long userId, FilePart filePart) {
        String photoId = userId + "_" + filePart.filename();

        return filePart.content().next()
                .flatMap(buffer -> {
                    byte[] imageData = new byte[buffer.readableByteCount()];
                    buffer.read(imageData);

                    String encodedImage = Base64.getEncoder().encodeToString(imageData);


                    photoProducer.sendPhotoForFaceCheck(photoId, encodedImage);

                    return photoListener.getFaceDetectionResponse(photoId)
                            .flatMap(response -> {
                                boolean hasFace = (boolean) response.get("analyse_result");
                                if (!hasFace) {
                                    return Mono.error(new RuntimeException("На фото не обнаружено лицо"));
                                }
                                return Mono.just(response);
                            });
                });
    }
// Нужно названия однородные для photos photo
    public Mono<Resource> loadUserPhoto(Long userId, String filename) {
        Path filePath = Paths.get(photoStoragePath, String.valueOf(userId), filename);
        try {
            Resource resource = new UrlResource(filePath.toUri());
            return resource.exists() ? Mono.just(resource) : Mono.error(new RuntimeException("Файл не найден"));
        } catch (MalformedURLException e) {
            return Mono.error(new RuntimeException("Не удалось загрузить файл", e));
        }
    }
    public Mono<Void> deleteUserPhoto(Long userId, String filename) {
        Path filePath = Paths.get(photoStoragePath, String.valueOf(userId), filename);
        try {
            Files.deleteIfExists(filePath);
            return Mono.empty();
        } catch (IOException e) {
            return Mono.error(new RuntimeException("Не удалось удалить файл", e));
        }
    }
}
