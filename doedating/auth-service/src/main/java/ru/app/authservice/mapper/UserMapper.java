package ru.app.authservice.mapper;

import ru.app.authservice.dto.UserRequestDTO;
import ru.app.authservice.dto.UserResponseDTO;
import ru.app.authservice.entity.User;
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