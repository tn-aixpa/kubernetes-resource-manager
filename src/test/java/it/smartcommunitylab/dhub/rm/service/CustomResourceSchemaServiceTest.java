package it.smartcommunitylab.dhub.rm.service;

import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import it.smartcommunitylab.dhub.rm.converter.SchemaToDTOConverter;
import it.smartcommunitylab.dhub.rm.model.CustomResourceSchema;
import it.smartcommunitylab.dhub.rm.model.IdAwareCustomResourceDefinition;
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

import java.io.Serializable;
import java.util.*;

@ExtendWith(MockitoExtension.class)
public class CustomResourceSchemaServiceTest {

    @Mock
    CustomResourceSchemaRepository customResourceSchemaRepository;

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

    }

    @Test
    public void testFindAll() {

        Pageable pageable = PageRequest.of(0, 10);

        IdAwareCustomResourceDefinition crd = Mockito.mock(IdAwareCustomResourceDefinition.class);
        CustomResourceDefinition crdDefinition = Mockito.mock(CustomResourceDefinition.class);

        Mockito.when(crd.getCrd()).thenReturn(crdDefinition);
        Mockito.when(crdDefinition.getMetadata()).thenReturn(Mockito.mock(ObjectMeta.class));
        Mockito.when(crdDefinition.getMetadata().getName()).thenReturn(crdName);

        Page<IdAwareCustomResourceDefinition> crdPage = new PageImpl<>(Collections.singletonList(crd), pageable, 1);
        Page<CustomResourceSchema> schemaPage = new PageImpl<>(Collections.singletonList(customResourceSchema), pageable, 1);

        Mockito.when(crdService.findAll(null, false, pageable)).thenReturn(crdPage);
        Mockito.when(crdService.fetchStoredVersionName(crdDefinition)).thenReturn(crdVersion);
        Mockito.when(customResourceSchemaRepository.findByCrdIdAndVersion(crdName, crdVersion)).thenReturn(Optional.of(customResourceSchema));
        Mockito.lenient().when(schemaToDTOConverter.convert(customResourceSchema)).thenReturn(customResourceSchemaDTO);

        Page<CustomResourceSchemaDTO> result1 = customResourceSchemaService.findAll(null, true, pageable);

        Assertions.assertNotNull(result1);
        Assertions.assertEquals(1, result1.getTotalElements());
        Assertions.assertEquals(crdName, result1.getContent().get(0).getCrdId());

        //

        Mockito.when(customResourceSchemaRepository.findAll(pageable)).thenReturn(schemaPage);

        Page<CustomResourceSchemaDTO> result2 = customResourceSchemaService.findAll(null, false, pageable);

        Assertions.assertNotNull(result2);
        Assertions.assertEquals(1, result2.getTotalElements());
        Assertions.assertEquals(crdName, result2.getContent().get(0).getCrdId());

        //

        List<String> ids = Collections.singletonList(crdName);
        Mockito.when(customResourceSchemaRepository.findByIdIn(ids, pageable)).thenReturn(schemaPage);

        Page<CustomResourceSchemaDTO> result3 = customResourceSchemaService.findAll(ids, false, pageable);

        Assertions.assertNotNull(result3);
        Assertions.assertEquals(1, result3.getTotalElements());
        Assertions.assertEquals(crdName, result3.getContent().get(0).getCrdId());
    }

    @Test
    public void testFindById(){

        Mockito.when(customResourceSchemaRepository.findById(crdName))
                .thenReturn(Optional.of(customResourceSchema));
        Mockito.lenient().when(schemaToDTOConverter.convert(customResourceSchema))
                .thenReturn(customResourceSchemaDTO);

        CustomResourceSchemaDTO result1 = customResourceSchemaService.findById(crdName);

        Assertions.assertNotNull(result1);
        Assertions.assertEquals(crdName, result1.getCrdId());
        Assertions.assertEquals(crdVersion, result1.getVersion());

        Mockito.when(customResourceSchemaRepository.findById(crdName)).thenReturn(Optional.empty());

        Assertions.assertThrows(NoSuchElementException.class, () -> {
            customResourceSchemaService.findById(crdName);
        });
    }

    @Test
    public void testFindByCrdIdAndVersion() {

        Mockito.when(customResourceSchemaRepository.findByCrdIdAndVersion(crdName, crdVersion))
                .thenReturn(Optional.of(customResourceSchema));
        Mockito.lenient().when(schemaToDTOConverter.convert(customResourceSchema))
                .thenReturn(customResourceSchemaDTO);

        CustomResourceSchemaDTO result1 = customResourceSchemaService.findByCrdIdAndVersion(crdName, crdVersion);

        Assertions.assertNotNull(result1);
        Assertions.assertEquals(crdName, result1.getCrdId());
        Assertions.assertEquals(crdVersion, result1.getVersion());

        Mockito.when(customResourceSchemaRepository.findByCrdIdAndVersion(crdName, crdVersion))
                .thenReturn(Optional.empty());

        Mockito.when(crdService.getCrdSchema(crdName, crdVersion))
                .thenReturn(Collections.singletonMap("field", "value"));
        Mockito.lenient().when(schemaToDTOConverter.convert(Mockito.any(CustomResourceSchema.class)))
                .thenReturn(customResourceSchemaDTO);

        CustomResourceSchemaDTO result2 = customResourceSchemaService.findByCrdIdAndVersion(crdName, crdVersion);

        Assertions.assertNotNull(result2);
        Assertions.assertEquals(crdName, result2.getCrdId());
        Assertions.assertEquals(crdVersion, result2.getVersion());

        Mockito.when(crdService.getCrdSchema(crdName, crdVersion)).thenReturn(null);

        Assertions.assertThrows(NoSuchElementException.class, () -> {
            customResourceSchemaService.findByCrdIdAndVersion(crdName, crdVersion);
        });
    }


    @Test
    public void testFindCRDByCrdIdAndVersion() {

        Mockito.when(customResourceSchemaRepository.findByCrdIdAndVersion(crdName, crdVersion)).thenReturn(Optional.of(customResourceSchema));

        CustomResourceSchema CRDResult = customResourceSchemaService.findCRDByCrdIdAndVersion(crdName, crdVersion);

        Assertions.assertNotNull(CRDResult);
        Assertions.assertEquals(crdName, CRDResult.getCrdId());
        Assertions.assertEquals(crdVersion, CRDResult.getVersion());

        //

        Mockito.when(customResourceSchemaRepository.findByCrdIdAndVersion(crdName, crdVersion))
                .thenReturn(Optional.empty());

        Map<String, Serializable> schemaMap = Collections.singletonMap("field", "value");
        Mockito.when(crdService.getCrdSchema(crdName, crdVersion))
                .thenReturn(schemaMap);

        CustomResourceSchema result2 = customResourceSchemaService.findCRDByCrdIdAndVersion(crdName, crdVersion);

        Assertions.assertNotNull(result2);
        Assertions.assertEquals(crdName, result2.getCrdId());
        Assertions.assertEquals(crdVersion, result2.getVersion());
        Assertions.assertEquals(schemaMap, result2.getSchema());

        //

        Mockito.when(crdService.getCrdSchema(crdName, crdVersion))
                .thenReturn(null);

        Assertions.assertThrows(NoSuchElementException.class, () -> {
            customResourceSchemaService.findCRDByCrdIdAndVersion(crdName, crdVersion);
        });
    }

    @Test
    public void testFindByCrdId(){

        Pageable pageable = PageRequest.of(0, 10);
        List<CustomResourceSchema> schemas = Collections.singletonList(customResourceSchema);
        Page<CustomResourceSchema> schemaPage = new PageImpl<>(schemas, pageable, schemas.size());

        Mockito.when(customResourceSchemaRepository.findByCrdId(crdName, pageable)).thenReturn(schemaPage);
        Mockito.lenient().when(schemaToDTOConverter.convert(customResourceSchema)).thenReturn(customResourceSchemaDTO);

        Page<CustomResourceSchemaDTO> result = customResourceSchemaService.findByCrdId(crdName, pageable);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.getTotalElements());

        CustomResourceSchemaDTO actualDTO = result.getContent().get(0);
        Assertions.assertEquals(customResourceSchemaDTO.getCrdId(), actualDTO.getCrdId());
        Assertions.assertEquals(customResourceSchemaDTO.getVersion(), actualDTO.getVersion());
    }

    @Test
    public void testAdd() {

        CustomResourceSchemaDTO dtoToAdd = new CustomResourceSchemaDTO();
        dtoToAdd.setCrdId("test-crd");
        dtoToAdd.setVersion("v1");

        Mockito.when(authService.isCrdAllowed(Mockito.anyString())).thenReturn(true);
        Mockito.when(crdService.crdExists("test-crd", "v1")).thenReturn(true);
        Mockito.when(customResourceSchemaRepository.save(Mockito.any())).thenAnswer(invocation -> {
            CustomResourceSchema savedSchema = invocation.getArgument(0);
            savedSchema.setId("01");
            return savedSchema;
        });

        CustomResourceSchemaDTO addedDTO = customResourceSchemaService.add(null, dtoToAdd);

        Assertions.assertNotNull(addedDTO);
        Assertions.assertEquals("test-crd", addedDTO.getCrdId());
        Assertions.assertEquals("v1", addedDTO.getVersion());
    }

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

    @Test
    public void testDelete(){

        Mockito.when(customResourceSchemaRepository.findById(crdName)).thenReturn(Optional.of(customResourceSchema));
        customResourceSchemaService.delete(crdName);

        Mockito.verify(customResourceSchemaRepository).deleteById(crdName);
    }

}
