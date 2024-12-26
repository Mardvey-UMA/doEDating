package ru.app.authservice.security;

import ru.app.authservice.enums.TokenType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class JwtHandler {

    private final String secret;

    public JwtHandler(@Value("${jwt.secret}") String secret) {
        this.secret = secret;
    }

    public Claims getClaimsFromToken(String token, TokenType requiredTokenType) {
        Claims claims = Jwts.parser()
                .setSigningKey(Base64.getEncoder().encodeToString(secret.getBytes()))
                .parseClaimsJws(token)
                .getBody();

        String tokenType = claims.get("token_type", String.class);
        if (tokenType == null || !TokenType.valueOf(tokenType).equals(requiredTokenType)) {
            throw new IllegalArgumentException("Invalid token type: " + tokenType);
        }

        return claims;
    }
}
