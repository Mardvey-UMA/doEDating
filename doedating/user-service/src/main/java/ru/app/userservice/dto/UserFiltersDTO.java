package ru.app.userservice.dto;

import ru.app.userservice.enums.Gender;

public class UserFiltersDTO {
    private Integer minAge;
    private Integer maxAge;
    private Gender genderFilter;
    private Integer searchRadius;

    public UserFiltersDTO(Integer minAge, Integer maxAge, Gender genderFilter, Integer searchRadius) {
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.genderFilter = genderFilter;
        this.searchRadius = searchRadius;
    }
}
