package com.hermes.hermes.repository;

import com.hermes.hermes.model.Capa;
import com.hermes.hermes.model.CapaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CapaRepository extends JpaRepository<Capa, Long> {
    Optional<Capa> findByCapaNumber(String capaNumber);
    List<Capa> findByStatus(CapaStatus status);
    long countByStatus(CapaStatus status);
}
