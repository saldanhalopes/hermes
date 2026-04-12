package com.hermes.hermes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class CapaAnalyticsDTO {
    private long totalOpen;
    private long overdueActions;
    private String avgClosureTime;
    private double effectivenessRate;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> sourceDistribution;
}
