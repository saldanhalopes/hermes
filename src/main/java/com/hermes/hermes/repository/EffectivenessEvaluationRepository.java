package com.hermes.hermes.repository;

import com.hermes.hermes.model.EffectivenessEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EffectivenessEvaluationRepository extends JpaRepository<EffectivenessEvaluation, Long> {
    Optional<EffectivenessEvaluation> findByChangeRequestId(Long changeRequestId);
}
