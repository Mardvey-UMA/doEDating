package ru.app.userservice.entity;

import ru.app.userservice.enums.Gender;
import ru.app.userservice.enums.Provider;
import ru.app.userservice.enums.Theme;
import ru.app.userservice.enums.UserRole;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static ru.app.userservice.enums.Gender.MALE;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class User {
    @Id
    private Long id;
    private String username;
    private UserRole role;
    private String firstName;
    private String lastName;
    private Long vkId;
    private boolean enabled;
    private Provider provider;

    private String email;
    private LocalDate birthDate = LocalDate.of(1970, 1, 1);
    private Integer age = 0;
    private Gender gender = MALE;
    private String city;
    private String job;
    private String education;
    private String aboutMe;
    private String telegramId;
    private String chatId;

    private Theme theme = Theme.light;

}
