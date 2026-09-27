package com.pethealth.config;

import com.pethealth.model.Service;
import com.pethealth.model.User;
import com.pethealth.model.Veterinarian;
import com.pethealth.repository.ServiceRepository;
import com.pethealth.repository.UserRepository;
import com.pethealth.repository.VetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VetRepository vetRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, VetRepository vetRepository,
                      ServiceRepository serviceRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vetRepository = vetRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@pethealth.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@pethealth.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .phone("555-0000")
                    .build();
            userRepository.save(admin);
        }

        if (vetRepository.count() == 0) {
            vetRepository.save(Veterinarian.builder().name("Dr. Sarah Johnson").specialization("General Practice").email("sarah@pethealth.com").phone("555-0101").build());
            vetRepository.save(Veterinarian.builder().name("Dr. Mike Williams").specialization("Surgery").email("mike@pethealth.com").phone("555-0102").build());
            vetRepository.save(Veterinarian.builder().name("Dr. Emily Chen").specialization("Dermatology").email("emily@pethealth.com").phone("555-0103").build());
        }

        if (serviceRepository.count() == 0) {
            serviceRepository.save(Service.builder().name("General Checkup").description("Full physical examination and health assessment").durationMinutes(30).price(new BigDecimal("50.00")).build());
            serviceRepository.save(Service.builder().name("Vaccination").description("Annual vaccine booster shots").durationMinutes(20).price(new BigDecimal("35.00")).build());
            serviceRepository.save(Service.builder().name("Dental Cleaning").description("Professional teeth cleaning and oral exam").durationMinutes(60).price(new BigDecimal("120.00")).build());
            serviceRepository.save(Service.builder().name("Surgery Consultation").description("Pre-surgery evaluation and planning").durationMinutes(45).price(new BigDecimal("80.00")).build());
            serviceRepository.save(Service.builder().name("Grooming").description("Bath, trim, and nail clipping").durationMinutes(90).price(new BigDecimal("65.00")).build());
        }
    }
}
