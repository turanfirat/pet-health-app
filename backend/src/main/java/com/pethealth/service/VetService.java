package com.pethealth.service;

import com.pethealth.dto.VetRequest;
import com.pethealth.model.Veterinarian;
import com.pethealth.repository.VetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VetService {

    private final VetRepository vetRepository;

    public VetService(VetRepository vetRepository) {
        this.vetRepository = vetRepository;
    }

    public List<Veterinarian> getAll() {
        return vetRepository.findAll();
    }

    public Veterinarian create(VetRequest request) {
        Veterinarian vet = Veterinarian.builder()
                .name(request.getName())
                .specialization(request.getSpecialization())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        return vetRepository.save(vet);
    }

    public Veterinarian update(Long id, VetRequest request) {
        Veterinarian vet = vetRepository.findById(id).orElseThrow();
        vet.setName(request.getName());
        vet.setSpecialization(request.getSpecialization());
        vet.setEmail(request.getEmail());
        vet.setPhone(request.getPhone());
        return vetRepository.save(vet);
    }

    public void delete(Long id) {
        vetRepository.deleteById(id);
    }
}
