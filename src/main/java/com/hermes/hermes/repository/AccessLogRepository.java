package com.hermes.hermes.repository;

import com.hermes.hermes.model.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    List<AccessLog> findTop100ByOrderByTimestampDesc();
}
