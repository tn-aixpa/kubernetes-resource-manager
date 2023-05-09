package it.smartcommunitylab.dhub.rm.repository;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomResourceSchemaRepository extends JpaRepository<CustomResourceSchema, String> {
    Optional<CustomResourceSchema> findByCrdIdAndVersion(String crdId, String version);
    //List<CustomResourceSchema> findByCrdId(String crdId);
}
