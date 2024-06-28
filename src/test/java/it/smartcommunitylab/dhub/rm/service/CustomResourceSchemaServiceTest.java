package it.smartcommunitylab.dhub.rm.service;

import it.smartcommunitylab.dhub.rm.converter.DTOToSchemaConverter;
import it.smartcommunitylab.dhub.rm.converter.SchemaToDTOConverter;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.dto.CustomResourceSchemaDTO;
import it.smartcommunitylab.dhub.rm.repository.CustomResourceSchemaRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class CustomResourceSchemaServiceTest {

    @Mock
    CustomResourceSchemaRepository customResourceSchemaRepository;

    @Mock
    DTOToSchemaConverter dtoToSchemaConverter;

    @Mock
    SchemaToDTOConverter schemaToDTOConverter;

    @Mock
    CustomResourceDefinitionService crdService;

    @Mock
    AuthorizationService authService;

    @InjectMocks
    CustomResourceSchemaService customResourceSchemaService;

    CustomResourceSchemaDTO customResourceSchemaDTO;
    CustomResourceSchema customResourceSchema;
    private final String crdName = "test-crd";
    private final String crdVersion = "v1";

    @BeforeEach
    public void setup() {

        customResourceSchema = new CustomResourceSchema();
        customResourceSchema.setCrdId(crdName);
        customResourceSchema.setVersion(crdVersion);

        customResourceSchemaDTO = new CustomResourceSchemaDTO();
        customResourceSchemaDTO.setCrdId(crdName);
        customResourceSchemaDTO.setVersion(crdVersion);

/*
        Mockito.when(customResourceSchemaRepository.findById(crdName)).thenReturn(Optional.of(customResourceSchema));
*/


    }

    //public Page<CustomResourceSchemaDTO> findAll(Collection<String> ids, boolean all, Pageable pageable)
    @Test
    public void testFindAll(){

    }

    //public CustomResourceSchemaDTO findById(String id)
    @Test
    public void testFindById(){

    }

    //public CustomResourceSchemaDTO findByCrdIdAndVersion(String crdId, String version)
    @Test
    public void testFindByCrdIdAndVersion(){

    }

    //public CustomResourceSchema findCRDByCrdIdAndVersion(String crdId, String version)
    @Test
    public void testFindCRDByCrdIdAndVersion(){

    }

    //public Page<CustomResourceSchemaDTO> findByCrdId(String crdId, Pageable pageable)
    @Test
    public void testFindByCrdId(){
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        List<CustomResourceSchema> schemas = Collections.singletonList(customResourceSchema);
        Page<CustomResourceSchema> schemaPage = new PageImpl<>(schemas, pageable, schemas.size());

        Mockito.when(customResourceSchemaRepository.findByCrdId(crdName, pageable)).thenReturn(schemaPage);
        Mockito.lenient().when(schemaToDTOConverter.convert(customResourceSchema)).thenReturn(customResourceSchemaDTO);

        // Act
        Page<CustomResourceSchemaDTO> result = customResourceSchemaService.findByCrdId(crdName, pageable);

        // Assert
        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.getTotalElements());

        // Compare the fields of the first item in the result list
        CustomResourceSchemaDTO actualDTO = result.getContent().get(0);
        Assertions.assertEquals(customResourceSchemaDTO.getCrdId(), actualDTO.getCrdId());
        Assertions.assertEquals(customResourceSchemaDTO.getVersion(), actualDTO.getVersion());
        // Compare other fields as needed
    }

    //public CustomResourceSchemaDTO add(@Nullable String id, CustomResourceSchemaDTO request)
    @Test
    public void testAdd() {
        //Arrange
        CustomResourceSchemaDTO dtoToAdd = new CustomResourceSchemaDTO();
        dtoToAdd.setCrdId("test-crd");
        dtoToAdd.setVersion("v1");

        Mockito.when(authService.isCrdAllowed(Mockito.anyString())).thenReturn(true); // Simulate authorization check passing
        Mockito.when(crdService.crdExists("test-crd", "v1")).thenReturn(true); // Simulate CRD exists
        Mockito.when(customResourceSchemaRepository.save(Mockito.any())).thenAnswer(invocation -> {
            // Simulate saving the schema and return the saved object
            CustomResourceSchema savedSchema = invocation.getArgument(0);
            savedSchema.setId("01");
            return savedSchema;
        });

        // Act
        CustomResourceSchemaDTO addedDTO = customResourceSchemaService.add(null, dtoToAdd);

        // Assert
        Assertions.assertNotNull(addedDTO); // Ensure something was returned
        Assertions.assertEquals("test-crd", addedDTO.getCrdId()); // Verify the crdId is correct
        Assertions.assertEquals("v1", addedDTO.getVersion()); // Verify the version is correct
    }

    //public CustomResourceSchemaDTO update(String id, CustomResourceSchemaDTO request)
    @Test
    public void testUpdate() {

        Mockito.when(customResourceSchemaRepository.findById(crdName)).thenReturn(Optional.of(customResourceSchema));

        Mockito.when(crdService.crdExists(crdName, crdVersion)).thenReturn(true);

        Mockito.when(customResourceSchemaRepository.save(customResourceSchema)).thenReturn(customResourceSchema);

        CustomResourceSchemaDTO updatedSchemaDTO = customResourceSchemaService.update(crdName, customResourceSchemaDTO);

        Assertions.assertNotNull(updatedSchemaDTO);

        Assertions.assertEquals(crdName, updatedSchemaDTO.getCrdId());
        Assertions.assertEquals(crdVersion, updatedSchemaDTO.getVersion());

    }


    //public void delete(String id)
    @Test
    public void testDelete(){

        Mockito.when(customResourceSchemaRepository.findById(crdName)).thenReturn(Optional.of(customResourceSchema));

        customResourceSchemaService.delete(crdName);

        Mockito.verify(customResourceSchemaRepository).deleteById(crdName);
    }




}
