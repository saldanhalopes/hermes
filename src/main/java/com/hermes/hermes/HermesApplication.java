package com.hermes.hermes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HermesApplication {

	public static void main(String[] args) {
		System.out.println("HERMES EQM: Starting Backend in OMEGA DIAGNOSTIC MODE...");
		SpringApplication.run(HermesApplication.class, args);
	}


}
