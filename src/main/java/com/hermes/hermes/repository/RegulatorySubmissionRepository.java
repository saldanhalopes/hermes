package com.hermes.hermes.repository;

import com.hermes.hermes.model.RegulatorySubmission;
import com.hermes.hermes.model.Market;
import com.hermes.hermes.model.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegulatorySubmissionRepository extends JpaRepository<RegulatorySubmission, Long> {
    List<RegulatorySubmission> findByMarket(Market market);
    List<RegulatorySubmission> findByStatus(SubmissionStatus status);
    
    long countByStatus(SubmissionStatus status);
    long countByMarket(Market market);
}
