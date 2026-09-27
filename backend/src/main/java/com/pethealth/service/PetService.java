package com.pethealth.service;

import com.pethealth.dto.PetRequest;
import com.pethealth.model.Pet;
import com.pethealth.model.User;
import com.pethealth.repository.PetRepository;
import com.pethealth.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public PetService(PetRepository petRepository, UserRepository userRepository) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    public List<Pet> getPetsByOwner(String email) {
        User owner = userRepository.findByEmail(email).orElseThrow();
        return petRepository.findByOwnerId(owner.getId());
    }

    public Pet addPet(String email, PetRequest request) {
        User owner = userRepository.findByEmail(email).orElseThrow();
        Pet pet = Pet.builder()
                .name(request.getName())
                .species(request.getSpecies())
                .breed(request.getBreed())
                .age(request.getAge())
                .weight(request.getWeight())
                .medicalNotes(request.getMedicalNotes())
                .owner(owner)
                .build();
        return petRepository.save(pet);
    }

    public Pet updatePet(Long id, String email, PetRequest request) {
        Pet pet = petRepository.findById(id).orElseThrow();
        if (!pet.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setAge(request.getAge());
        pet.setWeight(request.getWeight());
        pet.setMedicalNotes(request.getMedicalNotes());
        return petRepository.save(pet);
    }

    public void deletePet(Long id, String email) {
        Pet pet = petRepository.findById(id).orElseThrow();
        if (!pet.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        petRepository.delete(pet);
    }
}
