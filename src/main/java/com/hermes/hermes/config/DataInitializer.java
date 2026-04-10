package com.hermes.hermes.config;

import com.hermes.hermes.model.AreaConfig;
import com.hermes.hermes.model.User;
import com.hermes.hermes.repository.AreaConfigRepository;
import com.hermes.hermes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AreaConfigRepository areaConfigRepository;

    public DataInitializer(UserRepository userRepository, 
                           PasswordEncoder passwordEncoder, 
                           AreaConfigRepository areaConfigRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.areaConfigRepository = areaConfigRepository;
    }

    @Override
    public void run(String... args) {
        initAdminUser();
        initAreaConfigs();
    }

    private void initAdminUser() {
        if (userRepository.findByUsername("admin@hermes.com").isEmpty()) {
            User admin = new User();
            admin.setId("admin-id");
            admin.setUsername("admin@hermes.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@hermes.com");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Usuário ADMIN criado com sucesso.");
        }
    }

    private void initAreaConfigs() {
        if (areaConfigRepository.count() > 0) return;

        System.out.println("Inicializando configurações de áreas de avaliação...");

        // Áreas sem sub-áreas
        saveArea("AR",           "Assuntos Regulatórios",                  1,  false, null);
        saveArea("REG_SUB",      "Regulatório Subsidiárias",               2,  false, null);
        saveArea("SEG_TRAB",     "Segurança do Trabalho",                  3,  false, null);
        saveArea("SUPRIMENTOS",  "Suprimentos",                            4,  false, null);
        saveArea("ANALISE_DNP",  "Análise Prévia DNP",                     5,  false, null);
        saveArea("AR_MOMENTA",   "Assuntos Regulatórios Momenta",          6,  false, null);
        saveArea("PCP",          "PCP",                                    7,  false, null);
        saveArea("ALMOXARIFADO", "Almoxarifado",                           8,  false, null);

        // Validação — com sub-áreas
        saveArea("VALID", "Validação", 9, true,
                "Validação Processo - Impacto;Validação Limpeza - Impacto;Media Fill - Impacto;Sistema de água / Vapor - Impacto;Validação Outros - Impacto");

        saveArea("QUAL_INT",     "Qualidade Internacional",                10, false, null);
        saveArea("FARM_PROD",    "Farmacotécnica de Produto",              11, false, null);
        saveArea("CQ_FQ",        "CQ Físico Químico",                      12, false, null);

        // Qualificação — com sub-áreas
        saveArea("QUALIF", "Qualificação", 13, true,
                "HVAC - Impacto;Instalação, Operação e Desempenho / Térmica - Impacto;Gases - Impacto;Qualificação Outros - Impacto");

        saveArea("SERV_TERC",    "Serviços Terceiros",                     14, false, null);
        saveArea("DOC_TEC",      "Documentação Técnica",                   15, false, null);
        saveArea("CQ_MB",        "CQ Microbiológico",                      16, false, null);
        saveArea("QUAL_FORN",    "Qualificação de Fornecedores",           17, false, null);
        saveArea("MEIO_AMB",     "Meio Ambiente",                          18, false, null);
        saveArea("VAL_MET",      "Validação de Métodos",                   19, false, null);
        saveArea("CQ_LIMS",      "CQ Lims",                                20, false, null);
        saveArea("DADOS_MEST",   "Dados Mestres",                          21, false, null);
        saveArea("PRODUCAO",     "Produção",                               22, false, null);
        saveArea("ESTABILIDADE", "Estabilidade",                           23, false, null);
        saveArea("CQ_MOMENTA",   "CQ Momenta",                             24, false, null);
        saveArea("GQ_TERC",      "GQ Terceiros",                           25, false, null);
        saveArea("PROD_INEJ_M",  "Produção Injetáveis Momenta",            26, false, null);
        saveArea("DMA_MP",       "DMA MP",                                 27, false, null);
        saveArea("TI_PROJ",      "TI Projetos",                            28, false, null);
        saveArea("GQ_RECL_MKT",  "GQ Reclamação de Mercado",              29, false, null);
        saveArea("PROD_SOL_M",   "Produção Sólidos Momenta",               30, false, null);
        saveArea("DMA_PA",       "DMA PA",                                 31, false, null);
        saveArea("TI_INFRA",     "TI Infra",                               32, false, null);
        saveArea("GQ_MOMENTA",   "GQ Momenta",                             33, false, null);
        saveArea("PROD_BI5",     "Produção Itapevi BI 5",                  34, false, null);
        saveArea("DME",          "DME",                                    35, false, null);
        saveArea("GQ_OP_EST",    "GQ Operações Estéreis",                  36, false, null);
        saveArea("GQ_RIBEIRAO",  "GQ Ribeirão",                            37, false, null);
        saveArea("PROD_BI6",     "Produção Itapevi BI 6",                  38, false, null);
        saveArea("ENGENHARIA",   "Engenharia",                             39, false, null);
        saveArea("GQ_OP_SOL",    "GQ Operações Sólidos",                   40, false, null);
        saveArea("GQ_RJ",        "GQ Rio de Janeiro",                      41, false, null);
        saveArea("PROD_BI7",     "Produção Itapevi BI 7",                  42, false, null);
        saveArea("MANUTENCAO",   "Manutenção",                             43, false, null);
        saveArea("GQ_OP_LIQ",    "GQ Operações Líquidos e Semissólidos",   44, false, null);
        saveArea("GQ_MC",        "GQ Montes Claros",                       45, false, null);
        saveArea("PROD_BI9",     "Produção Itapevi BI 9",                  46, false, null);
        saveArea("EXCEL_IND",    "Excelência Industrial",                  47, false, null);
        saveArea("ESTAB_ACOMP",  "Estabilidade de acompanhamento",         48, false, null);
        saveArea("ARTES",        "Artes",                                  49, false, null);
        saveArea("MARKETING",    "Marketing",                              50, false, null);

        System.out.println("Áreas de avaliação inicializadas: " + areaConfigRepository.count() + " áreas.");
    }

    private void saveArea(String code, String name, int order, boolean hasSub, String subAreas) {
        if (!areaConfigRepository.existsByAreaCode(code)) {
            AreaConfig area = new AreaConfig();
            area.setAreaCode(code);
            area.setAreaName(name);
            area.setDisplayOrder(order);
            area.setHasSubAreas(hasSub);
            area.setSubAreasList(subAreas);
            area.setActive(true);
            areaConfigRepository.save(area);
        }
    }
}
