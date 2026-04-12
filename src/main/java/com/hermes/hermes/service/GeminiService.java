package com.hermes.hermes.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.List;

@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestTemplate restTemplate = new RestTemplate();

    public String analyzeImpact(String currentSelection, String proposedChange, String impactAreas) {
        if (apiKey == null || apiKey.isEmpty()) {
            return simulateAiAnalysis(currentSelection, proposedChange, impactAreas);
        }

        try {
            String prompt = String.format(
                "Atue como um Especialista de Garantia de Qualidade em uma Indústria Farmacêutica (GxP). " +
                "Analise a seguinte solicitação de mudança com foco em Integridade de Dados (ALCOA+) e Gerenciamento de Risco:\n" +
                "Contexto Atual: %s\n" +
                "Mudança Proposta: %s\n" +
                "Áreas de Impacto Selecionadas: %s\n\n" +
                "Forneça uma Análise de Impacto técnica, concisa e estruturada em tópicos, incluindo:\n" +
                "1. Riscos Regulatórios (ANVISA RDC 658/2022, FDA 21 CFR Part 11).\n" +
                "2. Impacto em Validação de Sistemas ou Qualificação de Equipamentos.\n" +
                "3. Ações mandatórias e controles de mitigação recomendados.",
                currentSelection, proposedChange, impactAreas
            );

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + apiKey, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Simplificação do parsing do JSON do Gemini
                List candidates = (List) response.getBody().get("candidates");
                Map candidate = (Map) candidates.get(0);
                Map content = (Map) candidate.get("content");
                List parts = (List) content.get("parts");
                Map part = (Map) parts.get(0);
                return (String) part.get("text");
            }
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
        }

        return simulateAiAnalysis(currentSelection, proposedChange, impactAreas);
    }

    public String suggestRCA(String problemDescription) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "### 🕵️ Sugestão de Causa Raiz (Simulação)\n\n" +
                   "Baseado na descrição: '" + problemDescription + "', as causas prováveis são:\n" +
                   "1. **Falha Humana:** Treinamento inadequado ou fadiga.\n" +
                   "2. **Equipamento:** Falta de manutenção preventiva ou calibração.\n" +
                   "3. **Processo:** SOP desatualizado ou pouco claro.";
        }

        try {
            String prompt = String.format(
                "Aja como um especialista em Qualidade Farmacêutica. " +
                "Analise o seguinte problema e sugira possíveis causas raiz (RCA) usando a metodologia do Diagrama de Ishikawa:\n" +
                "Problema: %s\n\n" +
                "Sugira causas para: Métodos, Mão de Obra, Materiais, Máquinas, Meio Ambiente e Medição.",
                problemDescription
            );
            return callGemini(prompt);
        } catch (Exception e) {
            log.error("Error calling Gemini for RCA: {}", e.getMessage());
            return "Erro ao gerar sugestão de RCA.";
        }
    }

    private String callGemini(String prompt) throws Exception {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + apiKey, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List candidates = (List) response.getBody().get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");
            List parts = (List) content.get("parts");
            Map part = (Map) parts.get(0);
            return (String) part.get("text");
        }
        return "Falha na comunicação com a IA.";
    }

    private String simulateAiAnalysis(String current, String proposed, String areas) {
        return "### 🤖 Análise de Impacto Sugerida (IA - Modo Simulação)\n\n" +
               "**Considerações Regulatórias:**\n" +
               "1. A mudança proposta em '" + proposed + "' impacta diretamente as áreas de: " + areas + ".\n" +
               "2. **Risco Crítico:** Verificado impacto potencial na integridade de dados (ALCOA+) e conformidade com a RDC 658/2022 (ANVISA).\n" +
               "3. **Ações Necessárias:**\n" +
               "   - Atualização da Análise de Risco (FMEA).\n" +
               "   - Revalidação parcial dos sistemas computadorizados envolvidos.\n" +
               "   - Treinamento obrigatório dos operadores antes da implementação.\n\n" +
               "*Nota: Configure a chave GEMINI_API_KEY para análises em tempo real.*";
    }
}
