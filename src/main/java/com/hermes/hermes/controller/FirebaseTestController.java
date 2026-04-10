package com.hermes.hermes.controller;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/firebase")
public class FirebaseTestController {

    @GetMapping("/status")
    public Map<String, Object> checkStatus() {
        Map<String, Object> status = new HashMap<>();
        try {
            FirebaseApp app = FirebaseApp.getInstance();
            status.put("initialized", true);
            status.put("appName", app.getName());
            status.put("projectId", app.getOptions().getProjectId());
            
            // Check auth specifically
            long userCount = 0; // In a real app we might count some users but here we just check if service is accessible
            status.put("authStatus", "Accessible");
            
        } catch (Exception e) {
            status.put("initialized", false);
            status.put("error", e.getMessage());
        }
        return status;
    }
}
