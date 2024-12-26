package ru.app.userservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import ru.app.userservice.enums.Gender;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table("user_filters")
public class UserFilters {
    @Id
    private Long id;
    private Long userId;
    private Integer minAge;
    private Integer maxAge;
    private Gender genderFilter;
    private Integer searchRadius;
    public UserFilters(Long userId) {
        this.userId = userId;
        this.minAge = 16;
        this.maxAge = 18;
        this.genderFilter = Gender.MALE;
        this.searchRadius = 50;
    }
}

