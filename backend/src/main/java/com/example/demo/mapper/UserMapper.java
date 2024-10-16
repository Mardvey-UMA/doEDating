package com.example.demo.mapper;

import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserRequestDTO;
import com.example.demo.entity.User;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDTO responseMap(User user);

    @InheritInverseConfiguration
    User responseMap(UserResponseDTO dto);

    UserRequestDTO requestMap(User user);

    @InheritInverseConfiguration
    User requestMap(UserRequestDTO dto);

}