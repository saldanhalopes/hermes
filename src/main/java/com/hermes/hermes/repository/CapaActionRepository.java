package com.hermes.hermes.repository;

import com.hermes.hermes.model.CapaAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CapaActionRepository extends JpaRepository<CapaAction, Long> {
    List<CapaAction> findByCapaId(Long capaId);
}
