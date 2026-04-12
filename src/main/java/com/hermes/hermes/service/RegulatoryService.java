package com.hermes.hermes.service;

import com.hermes.hermes.model.*;
import com.hermes.hermes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegulatoryService {

    private final RegulatorySubmissionRepository submissionRepository;
    private final ChangeRequestRepository changeRequestRepository;

    @Transactional
    public RegulatorySubmission createSubmission(RegulatorySubmission submission, List<Long> changeRequestIds) {
        submission.setSubmissionNumber(generateSubmissionNumber(submission.getMarket()));
        
        if (changeRequestIds != null && !changeRequestIds.isEmpty()) {
            List<ChangeRequest> changes = changeRequestRepository.findAllById(changeRequestIds);
            submission.setChangeRequests(changes);
        }
        
        return submissionRepository.save(submission);
    }

    private synchronized String generateSubmissionNumber(Market market) {
        long count = submissionRepository.count() + 1;
        return String.format("REG-%s-%04d", market.name().substring(0, 3), count);
    }

    @Transactional(readOnly = true)
    public List<RegulatorySubmission> findAll() {
        return submissionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public RegulatorySubmission getById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submissão não encontrada: " + id));
    }

    @Transactional(readOnly = true)
    public List<RegulatorySubmission> findByChangeRequestId(Long changeId) {
        return submissionRepository.findAll().stream()
                .filter(s -> s.getChangeRequests().stream().anyMatch(cr -> cr.getId().equals(changeId)))
                .toList();
    }

    @Transactional
    public RegulatorySubmission updateStatus(Long id, SubmissionStatus newStatus) {
        RegulatorySubmission submission = getById(id);
        
        // Basic validation: Cannot move from APPROVED/REJECTED back to DRAFT easily
        if (submission.getStatus() == SubmissionStatus.APPROVED && newStatus == SubmissionStatus.DRAFT) {
            throw new RuntimeException("Não é possível reverter uma submissão aprovada para rascunho.");
        }
        
        submission.setStatus(newStatus);
        if (newStatus == SubmissionStatus.APPROVED) {
            submission.setApprovalDate(java.time.LocalDate.now());
        }
        
        return submissionRepository.save(submission);
    }

    @Transactional
    public RegulatorySubmission linkChanges(Long submissionId, List<Long> changeIds) {
        RegulatorySubmission submission = getById(submissionId);
        List<ChangeRequest> changes = changeRequestRepository.findAllById(changeIds);
        
        for (ChangeRequest cr : changes) {
            if (!submission.getChangeRequests().contains(cr)) {
                submission.getChangeRequests().add(cr);
            }
        }
        
        return submissionRepository.save(submission);
    }

    /**
     * Checks if a Change Request has any pending regulatory submissions that block closure.
     * Implementation follows branching logic:
     * - PRIOR_APPROVAL / MAJOR_VARIATION: Must be APPROVED to close.
     * - NOTIFICATION / IMMEDIATE_IMPLEMENTATION / MINOR_VARIATION: Only blocks in DRAFT. (SUBMITTED = OK to close).
     */
    public boolean hasPendingSubmissions(Long changeRequestId) {
        List<RegulatorySubmission> allSubmissions = submissionRepository.findAll();
        
        return allSubmissions.stream()
                .filter(s -> s.getChangeRequests().stream().anyMatch(cr -> cr.getId().equals(changeRequestId)))
                .anyMatch(s -> {
                    SubmissionType type = s.getType();
                    SubmissionStatus status = s.getStatus();
                    
                    // Critical items block until final approval/rejection
                    if (type == SubmissionType.PRIOR_APPROVAL || type == SubmissionType.MAJOR_VARIATION || type == SubmissionType.RE_REGISTRATION) {
                        return status != SubmissionStatus.APPROVED && 
                               status != SubmissionStatus.REJECTED && 
                               status != SubmissionStatus.WITHDRAWN;
                    }
                    
                    // Non-critical items block ONLY if still in DRAFT
                    return status == SubmissionStatus.DRAFT;
                });
    }
}
