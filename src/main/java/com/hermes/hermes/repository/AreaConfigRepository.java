package com.hermes.hermes.repository;

import com.hermes.hermes.model.AreaConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AreaConfigRepository extends JpaRepository<AreaConfig, Long> {
    List<AreaConfig> findByActiveTrueOrderByDisplayOrder();
    Optional<AreaConfig> findByAreaCode(String areaCode);
    boolean existsByAreaCode(String areaCode);
}
