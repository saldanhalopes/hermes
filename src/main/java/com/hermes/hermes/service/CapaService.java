package com.hermes.hermes.service;

import com.hermes.hermes.model.*;
import com.hermes.hermes.model.CapaStatus;
import com.hermes.hermes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CapaService {

    private final CapaRepository capaRepository;
    private final CapaActionRepository capaActionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Capa createCapa(Capa capa) {
        // Assign requester
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // (Optional: Link creator if needed in model)

        capa.setCapaNumber(generateCapaNumber());
        capa.setStatus(CapaStatus.DRAFT);
        return capaRepository.save(capa);
    }

    private synchronized String generateCapaNumber() {
        long count = capaRepository.count() + 1;
        return String.format("CAPA-%06d", count);
    }

    @Transactional
    public Capa updateCapa(Long id, Capa details) {
        Capa existing = getById(id);
        
        existing.setTitle(details.getTitle());
        existing.setDescription(details.getDescription());
        existing.setSource(details.getSource());
        existing.setCriticality(details.getCriticality());
        
        // RCA Fields
        existing.setWhy1(details.getWhy1());
        existing.setWhy2(details.getWhy2());
        existing.setWhy3(details.getWhy3());
        existing.setWhy4(details.getWhy4());
        existing.setWhy5(details.getWhy5());
        existing.setRootCauseFinal(details.getRootCauseFinal());

        return capaRepository.save(existing);
    }

    @Transactional
    public CapaStatus updateStatus(Long id, CapaStatus newStatus) {
        Capa existing = getById(id);
        existing.setStatus(newStatus);
        capaRepository.save(existing);
        return newStatus;
    }

    @Transactional(readOnly = true)
    public Capa getById(Long id) {
        return capaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CAPA não encontrada: " + id));
    }

    @Transactional(readOnly = true)
    public List<Capa> findAll() {
        return capaRepository.findAll();
    }

    // --- Action Management ---

    @Transactional
    public CapaAction addAction(Long capaId, CapaAction action) {
        Capa capa = getById(capaId);
        action.setCapa(capa);
        return capaActionRepository.save(action);
    }

    @Transactional
    public void deleteAction(Long actionId) {
        capaActionRepository.deleteById(actionId);
    }
}
