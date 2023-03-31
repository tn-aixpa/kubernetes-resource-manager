package it.smartcommunitylab.dhub.rm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;

public interface CustomResourceSchemaRepository extends JpaRepository<CustomResourceSchema, String> {
    
}
