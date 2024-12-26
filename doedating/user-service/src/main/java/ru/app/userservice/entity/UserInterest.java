package ru.app.userservice.entity;

import lombok.*;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("user_interests")
public class UserInterest {
    private Long userId;
    private Long interestId;
}
