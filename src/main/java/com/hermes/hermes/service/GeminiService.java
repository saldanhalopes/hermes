package com.hermes.hermes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String defaultApiKey;

    @Value("${gemini.api.url}")
    private String defaultApiUrl;

    private final SettingsService settingsService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Sugere um plano de ação 5W2H com base na descrição da mudança.
     */
    public String suggestActionPlan(String changeDescription) {
        String apiKey = settingsService.getSetting("gemini.api.key", defaultApiKey);
        
        if ("YOUR_GEMINI_API_KEY_HERE".equals(apiKey)) {
            return "Erro: API Key do Gemini não configurada.";
        }

        String prompt = "Com base na seguinte descrição de mudança em um ambiente farmacêutico (Eurofarma), " +
                "sugira um plano de ação seguindo a metodologia 5W2H (What, Why, Where, When, Who, How, How Much). " +
                "Retorne apenas o JSON estruturado para uma lista de tarefas. " +
                "Descrição da mudança: " + changeDescription;

        try {
            return callGemini(prompt);
        } catch (Exception e) {
            return "Erro ao consultar a IA: " + e.getMessage();
        }
    }

    /**
     * Sugere um parecer técnico para uma área específica com base na proposta.
     */
    public String suggestTechnicalOpinion(String proposal, String area) {
        String apiKey = settingsService.getSetting("gemini.api.key", defaultApiKey);
        
        if ("YOUR_GEMINI_API_KEY_HERE".equals(apiKey)) {
            return "Erro: API Key do Gemini não configurada.";
        }

        String prompt = String.format(
            "Você é um especialista técnico na área de '%s' na Eurofarma. " +
            "Recebeu a seguinte proposta de mudança: '%s'. " +
            "Escreva um parecer técnico profissional e direto, descrevendo os possíveis impactos na sua área e sugerindo se a mudança deve ser aprovada ou se requer cuidados extras. " +
            "O texto deve ser formal, técnico e objetivo.",
            area, proposal
        );

        try {
            return callGemini(prompt);
        } catch (Exception e) {
            return "Erro ao consultar a IA: " + e.getMessage();
        }
    }

    private String callGemini(String prompt) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Estrutura do request para Gemini 1.5
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));

        Map<String, Object> body = new HashMap<>();
        body.put("contents", Collections.singletonList(content));

        String apiKey = settingsService.getSetting("gemini.api.key", defaultApiKey);
        String apiUrl = settingsService.getSetting("gemini.api.url", defaultApiUrl);
        
        String urlWithKey = apiUrl + "?key=" + apiKey;
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        String response = restTemplate.postForObject(urlWithKey, request, String.class);

        JsonNode root = objectMapper.readTree(response);
        return root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }
}
