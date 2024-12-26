package ru.app.userservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import ru.app.userservice.dto.OpenCageResponseDTO;
import ru.app.userservice.entity.UserCoordinates;

@Service
@RequiredArgsConstructor
public class GeoService {
    private final WebClient webClient;
    @Value("${geo.api-key}")
    private String apiKey;

    public Mono<UserCoordinates> fetchCoordinates(String cityName, Long userId) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.opencagedata.com")
                        .path("/geocode/v1/json")
                        .queryParam("q", cityName)
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(OpenCageResponseDTO.class)
                .map(response -> {
                    if (response.getResults() != null && !response.getResults().isEmpty()) {
                        var geometry = response.getResults().get(0).getGeometry();
                        return new UserCoordinates(
                                userId,
                                cityName,
                                geometry.getLat(),
                                geometry.getLng()
                        );
                    }
                    throw new RuntimeException("Не удалось получить координаты для города: " + cityName);
                });
    }
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaPhi = Math.toRadians(lat2 - lat1);
        double deltaLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
