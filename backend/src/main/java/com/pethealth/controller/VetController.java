package com.pethealth.controller;

import com.pethealth.model.Veterinarian;
import com.pethealth.service.VetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vets")
public class VetController {

    private final VetService vetService;

    public VetController(VetService vetService) {
        this.vetService = vetService;
    }

    @GetMapping
    public ResponseEntity<List<Veterinarian>> getAll() {
        return ResponseEntity.ok(vetService.getAll());
    }
}
