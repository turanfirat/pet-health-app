package com.pethealth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String species;
    private String breed;
    private Integer age;
    private Double weight;

    @Column(columnDefinition = "TEXT")
    private String medicalNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    public Pet() {}

    public Pet(Long id, String name, String species, String breed, Integer age, Double weight, String medicalNotes, User owner) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.weight = weight;
        this.medicalNotes = medicalNotes;
        this.owner = owner;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public String getMedicalNotes() { return medicalNotes; }
    public void setMedicalNotes(String medicalNotes) { this.medicalNotes = medicalNotes; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String species;
        private String breed;
        private Integer age;
        private Double weight;
        private String medicalNotes;
        private User owner;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder species(String species) { this.species = species; return this; }
        public Builder breed(String breed) { this.breed = breed; return this; }
        public Builder age(Integer age) { this.age = age; return this; }
        public Builder weight(Double weight) { this.weight = weight; return this; }
        public Builder medicalNotes(String medicalNotes) { this.medicalNotes = medicalNotes; return this; }
        public Builder owner(User owner) { this.owner = owner; return this; }

        public Pet build() {
            return new Pet(id, name, species, breed, age, weight, medicalNotes, owner);
        }
    }
}
