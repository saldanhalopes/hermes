package com.hermes.hermes.repository;

import com.hermes.hermes.model.ImpactAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImpactAnalysisRepository extends JpaRepository<ImpactAnalysis, Long> {

    List<ImpactAnalysis> findByChangeRequestIdOrderByDisplayOrder(Long changeRequestId);

    List<ImpactAnalysis> findByChangeRequestId(Long changeRequestId);

    Optional<ImpactAnalysis> findByChangeRequestIdAndAreaCode(Long changeRequestId, String areaCode);

    List<ImpactAnalysis> findByChangeRequestIdAndAreaEnabledTrue(Long changeRequestId);

    long countByChangeRequestIdAndAreaEnabledTrueAndCompletedFalse(Long changeRequestId);
}
