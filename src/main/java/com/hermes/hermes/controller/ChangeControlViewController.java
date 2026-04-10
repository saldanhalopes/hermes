package com.hermes.hermes.controller;

import com.hermes.hermes.model.ChangeRequest;
import com.hermes.hermes.model.ChangeStatus;
import com.hermes.hermes.model.ImpactAnalysis;
import com.hermes.hermes.repository.AreaConfigRepository;
import com.hermes.hermes.repository.ChangeRequestRepository;
import com.hermes.hermes.repository.ImpactAnalysisRepository;
import com.hermes.hermes.service.ChangeControlService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/change-control")
@RequiredArgsConstructor
public class ChangeControlViewController {

    private final ChangeRequestRepository changeRequestRepository;
    private final ChangeControlService changeControlService;
    private final ImpactAnalysisRepository impactAnalysisRepository;
    private final AreaConfigRepository areaConfigRepository;

    @GetMapping
    public String listChanges(Model model) {
        model.addAttribute("changes", changeRequestRepository.findAll());
        
        // Summary counts alinhados com o novo ChangeStatus
        model.addAttribute("countIdentification", changeRequestRepository.countByStatus(ChangeStatus.IDENTIFICATION));
        model.addAttribute("countImpactAnalysis", changeRequestRepository.countByStatus(ChangeStatus.IMPACT_ANALYSIS));
        model.addAttribute("countAreaEvaluation", changeRequestRepository.countByStatus(ChangeStatus.AREA_EVALUATION));
        model.addAttribute("countExecution", changeRequestRepository.countByStatus(ChangeStatus.EXECUTION));
        model.addAttribute("countAtrasadas", 0); // TODO: Implement overdue logic
        
        return "change-control/dashboard";
    }

    @GetMapping("/new")
    public String createChangeForm(Model model) {
        model.addAttribute("request", new ChangeRequest());
        model.addAttribute("editMode", false);
        return "change-control/forms/request";
    }

    @GetMapping("/{id}")
    public String viewDetails(@PathVariable Long id, Model model) {
        ChangeRequest request = changeControlService.getById(id);
        List<ImpactAnalysis> analyses = impactAnalysisRepository.findByChangeRequestIdOrderByDisplayOrder(id);
        
        long enabledCount = analyses.stream().filter(ImpactAnalysis::isAreaEnabled).count();
        long completedCount = analyses.stream().filter(ImpactAnalysis::isCompleted).count();

        model.addAttribute("request", request);
        model.addAttribute("impactAnalyses", analyses);
        model.addAttribute("enabledCount", enabledCount);
        model.addAttribute("completedCount", completedCount);
        model.addAttribute("flowchartData", generateMermaidChart(request));
        model.addAttribute("effectiveness", changeControlService.getEffectivenessEvaluation(id).orElse(null));
        
        return "change-control/details";
    }

    private String generateMermaidChart(ChangeRequest request) {
        if (request == null || request.getStatus() == null) return "";
        
        String status = request.getStatus().name();
        StringBuilder sb = new StringBuilder();
        sb.append("graph LR\n");
        sb.append("  ID((1)):::ident --> IA((2)):::impact\n");
        sb.append("  IA --> RR((3)):::reg\n");
        sb.append("  RR --> AE((4)):::area\n");
        sb.append("  AE --> CR((5)):::committee\n");
        sb.append("  CR --> AP((6)):::plan\n");
        sb.append("  AP --> EX((7)):::exec\n");
        sb.append("  EX --> EV((8)):::eff\n");
        sb.append("  EV --> CL((9)):::closed\n\n");
        
        sb.append("  classDef default fill:#f8fafc,stroke:#e2e8f0,stroke-width:2px,color:#64748b;\n");
        sb.append("  classDef active fill:#6366f1,stroke:#6366f1,stroke-width:4px,color:#fff;\n");
        sb.append("  classDef done fill:#10b981,stroke:#10b981,stroke-width:2px,color:#fff;\n\n");

        // Highlights baseado no status
        switch (status) {
            case "IDENTIFICATION" -> sb.append("  class ID active;");
            case "IMPACT_ANALYSIS" -> sb.append("  class ID done; class IA active;");
            case "REGULATORY_REVIEW" -> sb.append("  class ID,IA done; class RR active;");
            case "AREA_EVALUATION" -> sb.append("  class ID,IA,RR done; class AE active;");
            case "COMMITTEE_REVIEW" -> sb.append("  class ID,IA,RR,AE done; class CR active;");
            case "ACTION_PLAN" -> sb.append("  class ID,IA,RR,AE,CR done; class AP active;");
            case "ACTION_PLAN_APPROVAL" -> sb.append("  class ID,IA,RR,AE,CR done; class AP active;");
            case "EXECUTION" -> sb.append("  class ID,IA,RR,AE,CR,AP done; class EX active;");
            case "EFFECTIVENESS_VERIFICATION" -> sb.append("  class ID,IA,RR,AE,CR,AP,EX done; class EV active;");
            case "CLOSED" -> sb.append("  class ID,IA,RR,AE,CR,AP,EX,EV,CL done;");
        }
        
        return sb.toString();
    }

    @GetMapping("/{id}/select-areas")
    public String selectAreas(@PathVariable Long id, Model model) {
        model.addAttribute("request", changeControlService.getById(id));
        model.addAttribute("allAreas", areaConfigRepository.findByActiveTrueOrderByDisplayOrder());
        model.addAttribute("currentAnalyses", impactAnalysisRepository.findByChangeRequestId(id));
        return "change-control/forms/areas";
    }

    @GetMapping("/edit/{id}")
    public String editRequest(@PathVariable Long id, Model model) {
        model.addAttribute("request", changeControlService.getById(id));
        model.addAttribute("editMode", true);
        return "change-control/forms/request";
    }

    @GetMapping("/{id}/impact/{analysisId}")
    public String evaluationForm(@PathVariable Long id, @PathVariable Long analysisId, Model model) {
        model.addAttribute("request", changeControlService.getById(id));
        model.addAttribute("analysis", impactAnalysisRepository.findById(analysisId).orElseThrow());
        return "change-control/forms/impact";
    }
}
