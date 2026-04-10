package com.hermes.hermes.repository;

import com.hermes.hermes.model.ImpactSubArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImpactSubAreaRepository extends JpaRepository<ImpactSubArea, Long> {
    List<ImpactSubArea> findByParentAnalysisIdOrderByDisplayOrder(Long parentAnalysisId);
}
