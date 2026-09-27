package com.pethealth.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentRequest {
    @NotNull
    private Long petId;
    @NotNull
    private Long vetId;
    @NotNull
    private Long serviceId;
    @NotNull
    private LocalDate appointmentDate;
    @NotNull
    private LocalTime appointmentTime;
    private String notes;

    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }
    public Long getVetId() { return vetId; }
    public void setVetId(Long vetId) { this.vetId = vetId; }
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
