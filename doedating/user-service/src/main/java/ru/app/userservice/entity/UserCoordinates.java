package ru.app.userservice.entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table("user_coordinates")
public class UserCoordinates {
    @Id
    private Long id;
    private Long userId;
    private String city;
    private Double latitude;
    private Double longitude;

    public UserCoordinates(Long userId, String city, Double latitude, Double longitude) {
        this.userId = userId;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
    }

}
