package com.pethealth.service;

import com.pethealth.dto.ServiceRequest;
import com.pethealth.model.Service;
import com.pethealth.repository.ServiceRepository;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<Service> getAll() {
        return serviceRepository.findAll();
    }

    public Service create(ServiceRequest request) {
        Service service = Service.builder()
                .name(request.getName())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .price(request.getPrice())
                .build();
        return serviceRepository.save(service);
    }

    public Service update(Long id, ServiceRequest request) {
        Service service = serviceRepository.findById(id).orElseThrow();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setPrice(request.getPrice());
        return serviceRepository.save(service);
    }

    public void delete(Long id) {
        serviceRepository.deleteById(id);
    }
}
