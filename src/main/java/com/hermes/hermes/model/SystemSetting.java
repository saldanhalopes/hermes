package com.hermes.hermes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemSetting {

    @Id
    private String settingKey; // e.g., "gemini.api.key"

    private String settingValue;

    private String category; // e.g., "AI", "NOTIFICATIONS", "GENERAL"

    private String description;
}
