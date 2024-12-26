package ru.app.userservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("likes")
public class Like {
    @Id
    private Long id;
    private Long firstUserId;
    private Long secondUserId;
    private Integer typeOfLike;
    private LocalDateTime createdAt;
}
