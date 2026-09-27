package com.pethealth.controller;

import com.pethealth.dto.AppointmentRequest;
import com.pethealth.model.Appointment;
import com.pethealth.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getMyAppointments(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getMyAppointments(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@AuthenticationPrincipal UserDetails userDetails,
                                                          @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.createAppointment(userDetails.getUsername(), request));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, userDetails.getUsername()));
    }
}
