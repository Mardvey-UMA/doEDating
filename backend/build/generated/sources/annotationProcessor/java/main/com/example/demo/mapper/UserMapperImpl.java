package com.example.demo.mapper;

import com.example.demo.dto.UserRequestDTO;
import com.example.demo.dto.UserRequestDTO.UserRequestDTOBuilder;
import com.example.demo.dto.UserResponseDTO;
import com.example.demo.dto.UserResponseDTO.UserResponseDTOBuilder;
import com.example.demo.entity.User;
import com.example.demo.entity.User.UserBuilder;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-15T10:28:19+0400",
    comments = "version: 1.4.2.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.10.2.jar, environment: Java 17.0.11 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponseDTO responseMap(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponseDTOBuilder userResponseDTO = UserResponseDTO.builder();

        userResponseDTO.id( user.getId() );
        userResponseDTO.username( user.getUsername() );
        userResponseDTO.password( user.getPassword() );
        userResponseDTO.firstName( user.getFirstName() );
        userResponseDTO.lastName( user.getLastName() );
        userResponseDTO.enabled( user.isEnabled() );
        userResponseDTO.createdAt( user.getCreatedAt() );
        userResponseDTO.updatedAt( user.getUpdatedAt() );
        userResponseDTO.provider( user.getProvider() );

        return userResponseDTO.build();
    }

    @Override
    public User responseMap(UserResponseDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserBuilder user = User.builder();

        user.id( dto.getId() );
        user.username( dto.getUsername() );
        user.password( dto.getPassword() );
        user.firstName( dto.getFirstName() );
        user.lastName( dto.getLastName() );
        user.provider( dto.getProvider() );
        user.enabled( dto.isEnabled() );
        user.createdAt( dto.getCreatedAt() );
        user.updatedAt( dto.getUpdatedAt() );

        return user.build();
    }

    @Override
    public UserRequestDTO requestMap(User user) {
        if ( user == null ) {
            return null;
        }

        UserRequestDTOBuilder userRequestDTO = UserRequestDTO.builder();

        userRequestDTO.id( user.getId() );
        userRequestDTO.username( user.getUsername() );
        userRequestDTO.password( user.getPassword() );
        userRequestDTO.firstName( user.getFirstName() );
        userRequestDTO.lastName( user.getLastName() );

        return userRequestDTO.build();
    }

    @Override
    public User requestMap(UserRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserBuilder user = User.builder();

        user.id( dto.getId() );
        user.username( dto.getUsername() );
        user.password( dto.getPassword() );
        user.firstName( dto.getFirstName() );
        user.lastName( dto.getLastName() );

        return user.build();
    }
}
