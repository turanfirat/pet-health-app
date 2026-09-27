package com.pethealth.repository;

import com.pethealth.model.Veterinarian;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VetRepository extends JpaRepository<Veterinarian, Long> {
}
