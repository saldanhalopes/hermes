package com.hermes.hermes.repository;

import com.hermes.hermes.model.ActionPlanTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActionPlanTaskRepository extends JpaRepository<ActionPlanTask, Long> {
    List<ActionPlanTask> findByChangeRequestId(Long changeRequestId);
}
