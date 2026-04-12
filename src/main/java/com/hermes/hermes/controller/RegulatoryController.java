package com.hermes.hermes.controller;

import com.hermes.hermes.model.RegulatorySubmission;
import com.hermes.hermes.model.SubmissionStatus;
import com.hermes.hermes.service.RegulatoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/regulatory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RegulatoryController {

    private final RegulatoryService regulatoryService;

    @GetMapping
    public List<RegulatorySubmission> getAll() {
        return regulatoryService.findAll();
    }

    @GetMapping("/{id}")
    public RegulatorySubmission getById(@PathVariable Long id) {
        return regulatoryService.getById(id);
    }

    @GetMapping("/by-change/{changeId}")
    public List<RegulatorySubmission> getByChangeRequestId(@PathVariable Long changeId) {
        return regulatoryService.findByChangeRequestId(changeId);
    }

    @PostMapping
    public RegulatorySubmission create(@RequestBody RegulatorySubmission submission, 
                                     @RequestParam(required = false) List<Long> changeRequestIds) {
        return regulatoryService.createSubmission(submission, changeRequestIds);
    }

    @PatchMapping("/{id}/status")
    public RegulatorySubmission updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        SubmissionStatus status = SubmissionStatus.valueOf(payload.get("status"));
        return regulatoryService.updateStatus(id, status);
    }

    @PostMapping("/{id}/links")
    public RegulatorySubmission linkChanges(@PathVariable Long id, @RequestBody List<Long> changeIds) {
        return regulatoryService.linkChanges(id, changeIds);
    }
}
