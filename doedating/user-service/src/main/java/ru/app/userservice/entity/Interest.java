package ru.app.userservice.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("interests")
public class Interest {
    @Id
    private Long id;
    private String name;
    private String color;
    @Column("textColor")
    private String textColor;
}
