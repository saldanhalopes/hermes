package com.hermes.hermes.service;

import com.hermes.hermes.model.SystemSetting;
import com.hermes.hermes.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SystemSettingRepository repository;
    private final Environment env;

    public String getSetting(String key, String defaultValue) {
        return repository.findById(key)
                .map(SystemSetting::getSettingValue)
                .orElseGet(() -> env.getProperty(key, defaultValue));
    }

    public List<SystemSetting> getAllSettings() {
        return repository.findAll();
    }

    public List<SystemSetting> getByCategory(String category) {
        return repository.findByCategory(category);
    }

    @Transactional
    public void saveSetting(String key, String value, String category, String description) {
        SystemSetting setting = repository.findById(key)
                .orElse(new SystemSetting(key, value, category, description));
        setting.setSettingValue(value);
        setting.setCategory(category);
        setting.setDescription(description);
        repository.save(setting);
    }

    @Transactional
    public void updateSettings(Map<String, String> settingsMap) {
        settingsMap.forEach((key, value) -> {
            Optional<SystemSetting> existing = repository.findById(key);
            if (existing.isPresent()) {
                SystemSetting s = existing.get();
                s.setSettingValue(value);
                repository.save(s);
            }
        });
    }

    public Map<String, String> getAllSettingsAsMap() {
        return repository.findAll().stream()
                .collect(Collectors.toMap(SystemSetting::getSettingKey, SystemSetting::getSettingValue));
    }
}

