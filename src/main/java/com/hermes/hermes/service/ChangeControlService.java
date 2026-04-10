package com.hermes.hermes.service;

import com.hermes.hermes.controller.DashboardController;
import com.hermes.hermes.model.*;
import com.hermes.hermes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChangeControlService {

    private final ChangeRequestRepository changeRequestRepository;
    private final ImpactAnalysisRepository impactAnalysisRepository;
    private final ImpactSubAreaRepository impactSubAreaRepository;
    private final ActionPlanTaskRepository actionPlanTaskRepository;
    private final EffectivenessEvaluationRepository effectivenessEvaluationRepository;
    private final AreaConfigRepository areaConfigRepository;
    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final PushNotificationService pushNotificationService;
    private final ApplicationContext applicationContext;
    private final UserRepository userRepository;

    // =========================================================
    // CRIAÇÃO E GESTÃO DO CM
    // =========================================================

    @Transactional
    public ChangeRequest createRequest(ChangeRequest request) {
        // Atribuir usuário logado como requerente
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            userRepository.findByUsername(auth.getName()).ifPresent(request::setRequester);
        }

        // Gerar número único do CM
        request.setCmNumber(generateCmNumber());
        request.setStatus(ChangeStatus.IDENTIFICATION);
        ChangeRequest saved = changeRequestRepository.save(request);

        broadcastUpdate();

        if ("Crítica".equals(request.getCriticality()) || request.isEmergency()) {
            notifyAllAdmins("Alerta: Novo CM " + (request.isEmergency() ? "EMERGENCIAL" : "CRÍTICO") + " - " + request.getTitle());
        }

        return saved;
    }

    /**
     * Gera o próximo número de CM no formato CM-XXXXXX (6 dígitos)
     */
    private synchronized String generateCmNumber() {
        long count = changeRequestRepository.count() + 1;
        return String.format("CM-%06d", count);
    }

    @Transactional
    public ChangeRequest updateRequest(Long id, ChangeRequest requestDetails) {
        ChangeRequest existing = getById(id);

        existing.setTitle(requestDetails.getTitle());
        existing.setUnit(requestDetails.getUnit());
        existing.setChangeType(requestDetails.getChangeType());
        existing.setChangeSubtype(requestDetails.getChangeSubtype());
        existing.setCriticality(requestDetails.getCriticality());
        existing.setCurrentSituation(requestDetails.getCurrentSituation());
        existing.setProposedSituation(requestDetails.getProposedSituation());
        existing.setJustification(requestDetails.getJustification());
        existing.setAffectedProducts(requestDetails.getAffectedProducts());
        existing.setEmergency(requestDetails.isEmergency());
        existing.setEmergencyReason(requestDetails.getEmergencyReason());
        existing.setRelatedCms(requestDetails.getRelatedCms());
        existing.setResponsibleName(requestDetails.getResponsibleName());
        existing.setResponsibleArea(requestDetails.getResponsibleArea());

        return changeRequestRepository.save(existing);
    }

    @Transactional(readOnly = true)
    public ChangeRequest getById(Long id) {
        return changeRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação de mudança não encontrada: " + id));
    }

    @Transactional(readOnly = true)
    public List<ChangeRequest> findAll() {
        return changeRequestRepository.findAll();
    }

    // =========================================================
    // GESTÃO DE ÁREAS DE IMPACTO
    // =========================================================

    /**
     * Inicializa (ou atualiza) as áreas de impacto de um CM com base na configuração ativa.
     * Chamado após o GQ avaliar o CM e definir quais áreas participam.
     */
    @Transactional
    public void initializeImpactAreas(Long requestId, List<String> enabledAreaCodes) {
        ChangeRequest request = getById(requestId);
        List<AreaConfig> allAreas = areaConfigRepository.findByActiveTrueOrderByDisplayOrder();

        for (AreaConfig areaConfig : allAreas) {
            Optional<ImpactAnalysis> existing = impactAnalysisRepository
                    .findByChangeRequestIdAndAreaCode(requestId, areaConfig.getAreaCode());

            ImpactAnalysis analysis;
            if (existing.isPresent()) {
                analysis = existing.get();
            } else {
                analysis = new ImpactAnalysis();
                analysis.setChangeRequest(request);
                analysis.setAreaCode(areaConfig.getAreaCode());
                analysis.setAreaName(areaConfig.getAreaName());
                analysis.setDisplayOrder(areaConfig.getDisplayOrder());
            }

            boolean enabled = enabledAreaCodes.contains(areaConfig.getAreaCode());
            analysis.setAreaEnabled(enabled);
            impactAnalysisRepository.save(analysis);

            // Criar sub-áreas se necessário e ainda não existirem
            if (enabled && areaConfig.isHasSubAreas()) {
                List<String> subAreaNames = areaConfig.getSubAreasAsList();
                List<ImpactSubArea> existingSubAreas = impactSubAreaRepository
                        .findByParentAnalysisIdOrderByDisplayOrder(analysis.getId());

                if (existingSubAreas.isEmpty()) {
                    for (int i = 0; i < subAreaNames.size(); i++) {
                        ImpactSubArea subArea = new ImpactSubArea();
                        subArea.setParentAnalysis(analysis);
                        subArea.setSubAreaName(subAreaNames.get(i));
                        subArea.setDisplayOrder(i);
                        impactSubAreaRepository.save(subArea);
                    }
                }
            }
        }

        request.setStatus(ChangeStatus.AREA_EVALUATION);
        changeRequestRepository.save(request);
    }

    /**
     * Salva a avaliação de impacto de uma área específica
     */
    @Transactional
    public ImpactAnalysis updateImpactAnalysis(Long analysisId, ImpactAnalysis data) {
        ImpactAnalysis existing = impactAnalysisRepository.findById(analysisId)
                .orElseThrow(() -> new RuntimeException("Análise de impacto não encontrada: " + analysisId));

        existing.setImpactText(data.getImpactText());
        existing.setApprovalStatus(data.getApprovalStatus());
        existing.setEvaluatorName(data.getEvaluatorName());
        existing.setEvaluationDate(data.getEvaluationDate());

        // Marcar como concluída se tiver aprovação definida
        if (data.getApprovalStatus() != null && !data.getApprovalStatus().isBlank()) {
            existing.setCompleted(true);
        }

        return impactAnalysisRepository.save(existing);
    }

    /**
     * Salva o texto de impacto de uma sub-área específica
     */
    @Transactional
    public ImpactSubArea updateSubArea(Long subAreaId, String impactText) {
        ImpactSubArea subArea = impactSubAreaRepository.findById(subAreaId)
                .orElseThrow(() -> new RuntimeException("Sub-área não encontrada: " + subAreaId));
        subArea.setImpactText(impactText);
        return impactSubAreaRepository.save(subArea);
    }

    // =========================================================
    // TRANSIÇÕES DE STATUS (FLUXO DO CM)
    // =========================================================

    @Transactional
    public void submitForImpactAnalysis(Long requestId) {
        ChangeRequest request = getById(requestId);

        if (request.getJustification() == null || request.getJustification().isBlank()) {
            throw new RuntimeException("Justificativa é obrigatória para iniciar análise de impacto.");
        }

        request.setStatus(ChangeStatus.IMPACT_ANALYSIS);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void submitForRegulatoryReview(Long requestId) {
        ChangeRequest request = getById(requestId);
        request.setStatus(ChangeStatus.REGULATORY_REVIEW);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void submitForCommittee(Long requestId) {
        ChangeRequest request = getById(requestId);
        long pending = impactAnalysisRepository.countByChangeRequestIdAndAreaEnabledTrueAndCompletedFalse(requestId);
        if (pending > 0) {
            throw new RuntimeException("Existem " + pending + " área(s) pendentes de avaliação.");
        }
        request.setStatus(ChangeStatus.COMMITTEE_REVIEW);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void approveByCommittee(Long requestId) {
        ChangeRequest request = getById(requestId);
        request.setStatus(ChangeStatus.ACTION_PLAN);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void submitActionPlanForApproval(Long requestId) {
        ChangeRequest request = getById(requestId);
        if (actionPlanTaskRepository.findByChangeRequestId(requestId).isEmpty()) {
            throw new RuntimeException("É necessário ao menos uma tarefa no plano de ação.");
        }
        request.setStatus(ChangeStatus.ACTION_PLAN_APPROVAL);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void approveChange(Long requestId) {
        ChangeRequest request = getById(requestId);
        request.setStatus(ChangeStatus.EXECUTION);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void completeExecution(Long requestId) {
        List<ActionPlanTask> tasks = actionPlanTaskRepository.findByChangeRequestId(requestId);
        boolean allDone = tasks.stream().allMatch(t -> "Concluído".equals(t.getStatus()));
        if (!allDone) {
            throw new RuntimeException("Todas as tarefas do plano de ação devem ser concluídas antes da verificação de eficácia.");
        }
        ChangeRequest request = getById(requestId);
        request.setStatus(ChangeStatus.EFFECTIVENESS_VERIFICATION);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void closeChange(Long requestId) {
        ChangeRequest request = getById(requestId);
        request.setStatus(ChangeStatus.CLOSED);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void cancelChange(Long requestId) {
        ChangeRequest request = getById(requestId);
        request.setStatus(ChangeStatus.CANCELLED);
        changeRequestRepository.save(request);
    }

    @Transactional
    public void abandonChange(Long requestId) {
        ChangeRequest request = getById(requestId);
        if (request.getStatus() != ChangeStatus.IDENTIFICATION) {
            throw new RuntimeException("Desistência só é permitida na fase de identificação.");
        }
        request.setStatus(ChangeStatus.ABANDONED);
        changeRequestRepository.save(request);
    }

    // =========================================================
    // VERIFICAÇÃO DE EFICÁCIA
    // =========================================================

    @Transactional
    public EffectivenessEvaluation saveEffectivenessEvaluation(Long requestId, EffectivenessEvaluation data) {
        ChangeRequest request = getById(requestId);

        EffectivenessEvaluation eval = effectivenessEvaluationRepository
                .findByChangeRequestId(requestId)
                .orElse(new EffectivenessEvaluation());

        eval.setChangeRequest(request);
        eval.setEvaluationText(data.getEvaluationText());
        eval.setResult(data.getResult());
        eval.setEvaluatedBy(data.getEvaluatedBy());
        eval.setEvaluationDate(data.getEvaluationDate());

        EffectivenessEvaluation saved = effectivenessEvaluationRepository.save(eval);

        // Se resultado definido, encerrar o CM
        if ("Eficaz".equals(data.getResult())) {
            closeChange(requestId);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public Optional<EffectivenessEvaluation> getEffectivenessEvaluation(Long requestId) {
        return effectivenessEvaluationRepository.findByChangeRequestId(requestId);
    }

    // =========================================================
    // PLANO DE AÇÃO
    // =========================================================

    @Transactional
    public ActionPlanTask saveTask(Long requestId, ActionPlanTask task) {
        ChangeRequest request = getById(requestId);
        task.setChangeRequest(request);

        // Gerar identificador sequencial se não fornecido
        if (task.getIdentifier() == null || task.getIdentifier().isBlank()) {
            long taskCount = actionPlanTaskRepository.findByChangeRequestId(requestId).size() + 1;
            task.setIdentifier(String.format("%06d", taskCount));
        }

        return actionPlanTaskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        actionPlanTaskRepository.deleteById(taskId);
    }

    // =========================================================
    // BUSCA DE CMs RELACIONADOS
    // =========================================================

    @Transactional(readOnly = true)
    public List<ChangeRequest> findRelatedCMs(String cmNumbers) {
        if (cmNumbers == null || cmNumbers.isBlank()) return List.of();
        String[] numbers = cmNumbers.split("[,;\\s]+");
        return changeRequestRepository.findByCmNumberIn(List.of(numbers));
    }

    // =========================================================
    // UTILITÁRIOS
    // =========================================================

    private void broadcastUpdate() {
        applicationContext.getBean(DashboardController.class).broadcastAnalyticsUpdate();
    }

    private void notifyAllAdmins(String message) {
        pushSubscriptionRepository.findAll().forEach(sub ->
                pushNotificationService.sendPushNotification(sub, message));
    }
}
