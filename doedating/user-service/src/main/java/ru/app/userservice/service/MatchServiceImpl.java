package ru.app.userservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import ru.app.userservice.entity.Match;
import ru.app.userservice.repository.MatchRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchServiceImpl {
    private final MatchRepository matchRepository;

    public Flux<Match> getList() {
        return matchRepository.findAll();
    }

    public Flux<Match> getListById(Long userId) {
        return matchRepository.findAllByUserId1(userId);
    }
}
