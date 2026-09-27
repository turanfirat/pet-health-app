package com.pethealth.service;

import com.pethealth.dto.AppointmentRequest;
import com.pethealth.model.*;
import com.pethealth.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PetRepository petRepository;
    private final VetRepository vetRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, PetRepository petRepository,
                               VetRepository vetRepository, ServiceRepository serviceRepository,
                               UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.petRepository = petRepository;
        this.vetRepository = vetRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    public List<Appointment> getMyAppointments(String email) {
        User owner = userRepository.findByEmail(email).orElseThrow();
        return appointmentRepository.findByOwnerId(owner.getId());
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment createAppointment(String email, AppointmentRequest request) {
        User owner = userRepository.findByEmail(email).orElseThrow();
        Pet pet = petRepository.findById(request.getPetId()).orElseThrow();
        Veterinarian vet = vetRepository.findById(request.getVetId()).orElseThrow();
        com.pethealth.model.Service service = serviceRepository.findById(request.getServiceId()).orElseThrow();

        Appointment appointment = Appointment.builder()
                .pet(pet)
                .owner(owner)
                .vet(vet)
                .service(service)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .notes(request.getNotes())
                .status(Appointment.Status.PENDING)
                .build();

        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long id, String email) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        if (!appointment.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        appointment.setStatus(Appointment.Status.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        appointment.setStatus(Appointment.Status.valueOf(status.toUpperCase()));
        return appointmentRepository.save(appointment);
    }

    public long countByStatus(Appointment.Status status) {
        return appointmentRepository.countByStatus(status);
    }
}
