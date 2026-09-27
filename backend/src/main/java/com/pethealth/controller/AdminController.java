package com.pethealth.controller;

import com.pethealth.dto.ServiceRequest;
import com.pethealth.dto.StatusUpdateRequest;
import com.pethealth.dto.VetRequest;
import com.pethealth.model.Appointment;
import com.pethealth.model.Service;
import com.pethealth.model.Veterinarian;
import com.pethealth.service.AppointmentService;
import com.pethealth.service.ServiceService;
import com.pethealth.service.VetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AppointmentService appointmentService;
    private final VetService vetService;
    private final ServiceService serviceService;

    public AdminController(AppointmentService appointmentService,
                           VetService vetService,
                           ServiceService serviceService) {
        this.appointmentService = appointmentService;
        this.vetService = vetService;
        this.serviceService = serviceService;
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id,
                                                     @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, request.getStatus()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", (long) appointmentService.getAllAppointments().size());
        stats.put("pending", appointmentService.countByStatus(Appointment.Status.PENDING));
        stats.put("confirmed", appointmentService.countByStatus(Appointment.Status.CONFIRMED));
        stats.put("completed", appointmentService.countByStatus(Appointment.Status.COMPLETED));
        stats.put("cancelled", appointmentService.countByStatus(Appointment.Status.CANCELLED));
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/vets")
    public ResponseEntity<Veterinarian> createVet(@RequestBody VetRequest request) {
        return ResponseEntity.ok(vetService.create(request));
    }

    @PutMapping("/vets/{id}")
    public ResponseEntity<Veterinarian> updateVet(@PathVariable Long id, @RequestBody VetRequest request) {
        return ResponseEntity.ok(vetService.update(id, request));
    }

    @DeleteMapping("/vets/{id}")
    public ResponseEntity<Void> deleteVet(@PathVariable Long id) {
        vetService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/services")
    public ResponseEntity<Service> createService(@RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.create(request));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.update(id, request));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
