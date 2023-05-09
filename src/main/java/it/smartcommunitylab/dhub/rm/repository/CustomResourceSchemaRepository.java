package it.smartcommunitylab.dhub.rm.repository;

import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomResourceSchemaRepository extends JpaRepository<CustomResourceSchema, String> {
    Optional<CustomResourceSchema> findByCrdIdAndVersion(String crdId, String version);
    Page<CustomResourceSchema> findByCrdId(String crdId, Pageable pageable);
    Page<CustomResourceSchema> findByIdIn(Collection<String> ids, Pageable pageable);
}
