package com.hermes.hermes.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
public class DebugController {

    @GetMapping("/debug/whoami")
    public String whoami() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return "Não autenticado";
        
        return "Usuário: " + auth.getName() + " | Authorities: " + 
               auth.getAuthorities().stream()
                   .map(a -> a.getAuthority())
                   .collect(Collectors.joining(", "));
    }
}
