package com.hermes.hermes.controller;

import com.hermes.hermes.model.Capa;
import com.hermes.hermes.model.CapaAction;
import com.hermes.hermes.model.CapaStatus;
import com.hermes.hermes.service.CapaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/capas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CapaController {

    private final com.hermes.hermes.service.CapaService capaService;
    private final com.hermes.hermes.service.GeminiService geminiService;

    @PostMapping("/suggest-rca")
    public ResponseEntity<String> suggestRCA(@RequestBody String problemDescription) {
        return ResponseEntity.ok(geminiService.suggestRCA(problemDescription));
    }

    @GetMapping
    public List<Capa> getAll() {
        return capaService.findAll();
    }

    @GetMapping("/{id}")
    public Capa getById(@PathVariable Long id) {
        return capaService.getById(id);
    }

    @PostMapping
    public Capa create(@RequestBody Capa capa) {
        return capaService.createCapa(capa);
    }

    @PutMapping("/{id}")
    public Capa update(@PathVariable Long id, @RequestBody Capa details) {
        return capaService.updateCapa(id, details);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CapaStatus> updateStatus(@PathVariable Long id, @RequestBody CapaStatus status) {
        return ResponseEntity.ok(capaService.updateStatus(id, status));
    }

    @PostMapping("/{id}/actions")
    public CapaAction addAction(@PathVariable Long id, @RequestBody CapaAction action) {
        return capaService.addAction(id, action);
    }

    @DeleteMapping("/actions/{actionId}")
    public ResponseEntity<Void> deleteAction(@PathVariable Long actionId) {
        capaService.deleteAction(actionId);
        return ResponseEntity.ok().build();
    }
}
