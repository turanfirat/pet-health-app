package com.pethealth.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Veterinarian vet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Appointment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public Veterinarian getVet() { return vet; }
    public void setVet(Veterinarian vet) { this.vet = vet; }
    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Pet pet;
        private User owner;
        private Veterinarian vet;
        private Service service;
        private LocalDate appointmentDate;
        private LocalTime appointmentTime;
        private Status status = Status.PENDING;
        private String notes;

        public Builder pet(Pet pet) { this.pet = pet; return this; }
        public Builder owner(User owner) { this.owner = owner; return this; }
        public Builder vet(Veterinarian vet) { this.vet = vet; return this; }
        public Builder service(Service service) { this.service = service; return this; }
        public Builder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public Builder appointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; return this; }
        public Builder status(Status status) { this.status = status; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }

        public Appointment build() {
            Appointment a = new Appointment();
            a.pet = this.pet;
            a.owner = this.owner;
            a.vet = this.vet;
            a.service = this.service;
            a.appointmentDate = this.appointmentDate;
            a.appointmentTime = this.appointmentTime;
            a.status = this.status;
            a.notes = this.notes;
            return a;
        }
    }

    public enum Status { PENDING, CONFIRMED, CANCELLED, COMPLETED }
}
