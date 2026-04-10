package com.hermes.hermes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;
import java.util.List;

@Data
@Builder
public class AnalyticsUpdateDTO {
    private long totalChanges;
    private long pendingChanges;
    private long approvedChanges;
    private long totalUsers;
    private Map<String, Long> typeDistribution;
    private List<Long> monthlyTrend;
}
