package ru.app.userservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("photos")
public class Photo {
    @Id
    private Long id;
    private Long userId;
    private String path;
}
