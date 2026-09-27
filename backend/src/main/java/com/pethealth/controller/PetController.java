package com.pethealth.controller;

import com.pethealth.dto.PetRequest;
import com.pethealth.model.Pet;
import com.pethealth.service.PetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getMyPets(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.getPetsByOwner(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Pet> addPet(@AuthenticationPrincipal UserDetails userDetails,
                                      @Valid @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.addPet(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails userDetails,
                                         @Valid @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.updatePet(id, userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        petService.deletePet(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
