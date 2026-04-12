package com.hermes.hermes.config;

import com.hermes.hermes.model.*;
import com.hermes.hermes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ChangeRequestRepository changeRequestRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (changeRequestRepository.count() == 0) {
            
            // 1. Create a default admin user if not exists
            User admin = userRepository.findByUsername("admin").orElseGet(() -> {
                User u = new User();
                u.setId("admin-uid");
                u.setUsername("admin");
                u.setPassword("admin");
                u.setEmail("admin@hermes.com");
                u.setRole("ADMIN");
                return userRepository.save(u);
            });

            // 2. Create Sample Change Requests
            createCM("Qualificação de Novo HPLC - Lab 04", "Eurofarma Itapevi", "Ativo fixo", "Laboratorial", "Média", ChangeStatus.CLOSED, admin);
            createCM("Alteração de Master Batch - Produto X", "Eurofarma Interlagos", "Processo", "Produção", "Crítica", ChangeStatus.EXECUTION, admin);
            createCM("Novo Fornecedor de Blister PVC", "Eurofarma Itapevi", "Material", "Suprimentos", "Baixa", ChangeStatus.IDENTIFICATION, admin);
            createCM("Retrofit de Sistema HVAC - Bloco B", "Eurofarma Interlagos", "Utilidades", "Manutenção", "Crítica", ChangeStatus.IMPACT_ANALYSIS, admin);
            createCM("Atualização de Software de Lims", "Eurofarma Itapevi", "Sistema", "TI", "Média", ChangeStatus.ABANDONED, admin);

            System.out.println(">>> SEED DATA LOADED SUCCESSFULLY <<<");
        }
    }

    private void createCM(String title, String unit, String type, String area, String criticality, ChangeStatus status, User requester) {
        ChangeRequest cr = new ChangeRequest();
        cr.setTitle(title);
        cr.setUnit(unit);
        cr.setChangeType(type);
        cr.setResponsibleArea(area);
        cr.setResponsibleName(requester.getUsername());
        cr.setCriticality(criticality);
        cr.setStatus(status);
        cr.setRequester(requester);
        cr.setOpeningDate(LocalDate.now());
        cr.setCurrentSituation("A situação atual utiliza equipamentos antigos ou processos manuais que necessitam de modernização para otimização de workflow.");
        cr.setProposedSituation("Implementação de nova tecnologia/procedimento para aumentar a produtividade e garantir a conformidade regulatória GxP.");
        cr.setJustification("Melhoria contínua e mitigação de riscos operacionais identificados em auditorias internas.");
        cr.setCmNumber(String.format("CM-%06d", changeRequestRepository.count() + 1));
        changeRequestRepository.save(cr);
    }
}
