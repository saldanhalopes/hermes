package com.hermes.hermes.controller;

import com.hermes.hermes.model.ActionPlanTask;
import com.hermes.hermes.model.ChangeRequest;
import com.hermes.hermes.model.EffectivenessEvaluation;
import com.hermes.hermes.model.ImpactAnalysis;
import com.hermes.hermes.service.ChangeControlService;
import com.hermes.hermes.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/change-control")
public class ChangeControlController {

    private final ChangeControlService changeControlService;
    private final GeminiService geminiService;

    public ChangeControlController(ChangeControlService changeControlService, 
                                   GeminiService geminiService) {
        this.changeControlService = changeControlService;
        this.geminiService = geminiService;
    }

    @PostMapping("/requests")
    public ResponseEntity<ChangeRequest> createRequest(@RequestBody ChangeRequest request) {
        return ResponseEntity.ok(changeControlService.createRequest(request));
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<ChangeRequest> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(changeControlService.getById(id));
    }

    @PutMapping("/requests/{id}")
    public ResponseEntity<ChangeRequest> updateRequest(@PathVariable Long id, @RequestBody ChangeRequest request) {
        return ResponseEntity.ok(changeControlService.updateRequest(id, request));
    }

    // --- Fluxo e Status ---

    @PostMapping("/requests/{id}/submit-impact")
    public ResponseEntity<Void> submitImpact(@PathVariable Long id) {
        changeControlService.submitForImpactAnalysis(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/initialize-areas")
    public ResponseEntity<Void> initializeAreas(@PathVariable Long id, @RequestBody List<String> enabledAreaCodes) {
        changeControlService.initializeImpactAreas(id, enabledAreaCodes);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/submit-committee")
    public ResponseEntity<Void> submitCommittee(@PathVariable Long id) {
        changeControlService.submitForCommittee(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/approve-committee")
    public ResponseEntity<Void> approveCommittee(@PathVariable Long id) {
        changeControlService.approveByCommittee(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/submit-plan-approval")
    public ResponseEntity<Void> submitPlanApproval(@PathVariable Long id) {
        changeControlService.submitActionPlanForApproval(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/approve-execution")
    public ResponseEntity<Void> approveExecution(@PathVariable Long id) {
        changeControlService.approveChange(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/complete-execution")
    public ResponseEntity<Void> completeExecution(@PathVariable Long id) {
        changeControlService.completeExecution(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/close")
    public ResponseEntity<Void> close(@PathVariable Long id) {
        changeControlService.closeChange(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{id}/abandon")
    public ResponseEntity<Void> abandon(@PathVariable Long id) {
        changeControlService.abandonChange(id);
        return ResponseEntity.ok().build();
    }

    // --- Avaliações de Impacto ---

    @PutMapping("/impact/{analysisId}")
    public ResponseEntity<ImpactAnalysis> updateImpact(@PathVariable Long analysisId, @RequestBody ImpactAnalysis analysis) {
        return ResponseEntity.ok(changeControlService.updateImpactAnalysis(analysisId, analysis));
    }

    @PutMapping("/sub-area/{subAreaId}")
    public ResponseEntity<Void> updateSubArea(@PathVariable Long subAreaId, @RequestBody Map<String, String> body) {
        changeControlService.updateSubArea(subAreaId, body.get("impactText"));
        return ResponseEntity.ok().build();
    }

    // --- Plano de Ação ---

    @PostMapping("/requests/{id}/tasks")
    public ResponseEntity<ActionPlanTask> saveTask(@PathVariable Long id, @RequestBody ActionPlanTask task) {
        return ResponseEntity.ok(changeControlService.saveTask(id, task));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        changeControlService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }

    // --- Verificação de Eficácia ---

    @PostMapping("/requests/{id}/effectiveness")
    public ResponseEntity<EffectivenessEvaluation> saveEffectiveness(@PathVariable Long id, @RequestBody EffectivenessEvaluation evaluation) {
        return ResponseEntity.ok(changeControlService.saveEffectivenessEvaluation(id, evaluation));
    }

    @GetMapping("/requests/{id}/effectiveness")
    public ResponseEntity<EffectivenessEvaluation> getEffectiveness(@PathVariable Long id) {
        return changeControlService.getEffectivenessEvaluation(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Relacionados ---

    @GetMapping("/requests/{id}/related")
    public ResponseEntity<List<ChangeRequest>> getRelated(@RequestParam String numbers) {
        return ResponseEntity.ok(changeControlService.findRelatedCMs(numbers));
    }

    // --- IA Assistant ---

    @GetMapping("/ai-suggest")
    public ResponseEntity<String> suggestOpinion(@RequestParam String description, @RequestParam String area) {
        return ResponseEntity.ok(geminiService.suggestTechnicalOpinion(description, area));
    }
}
