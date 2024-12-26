package ru.app.userservice.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import ru.app.userservice.entity.Match;

public interface MatchRepository extends R2dbcRepository<Match, Long> {

    @Query("SELECT * FROM matches WHERE :user_id1 = user_id1 OR :user_id1 = user_id2")
    Flux<Match> findAllByUserId1(@Param("user_id1")  Long userId1);
}
