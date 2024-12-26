package ru.app.userservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import ru.app.userservice.enums.Gender;
import ru.app.userservice.enums.Provider;
import ru.app.userservice.enums.Theme;
import ru.app.userservice.enums.UserRole;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthDate;
    private Integer age;
    private Gender gender;
    private String city;
    private String job;
    private String education;
    private String aboutMe;
    private List<Long> selectedInterests;
    private List<String> photos;
    private String chatId;
    private String telegramId;
    private String theme;
}
