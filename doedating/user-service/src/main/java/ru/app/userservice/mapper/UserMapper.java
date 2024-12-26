package ru.app.userservice.mapper;

import ru.app.userservice.dto.UserResponseDTO;
import ru.app.userservice.dto.UserRequestDTO;
import ru.app.userservice.entity.User;
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