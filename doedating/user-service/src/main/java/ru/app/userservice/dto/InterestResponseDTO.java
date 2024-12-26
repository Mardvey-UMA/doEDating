package ru.app.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterestResponseDTO {
    private String name;
    private String color;
    private String textColor;
}

