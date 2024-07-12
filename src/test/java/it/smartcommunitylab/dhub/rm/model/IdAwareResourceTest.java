package it.smartcommunitylab.dhub.rm.model;

import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class IdAwareResourceTest {

    private HasMetadata mockHasMetadata;

    private final String name = "test-crd";

    @BeforeEach
    public void setUp() {

        mockHasMetadata = Mockito.mock(HasMetadata.class);
        ObjectMeta mockObjectMeta = Mockito.mock(ObjectMeta.class);

        Mockito.when(mockHasMetadata.getMetadata()).thenReturn(mockObjectMeta);
        Mockito.when(mockObjectMeta.getName()).thenReturn(name);
    }

    @Test
    public void testConstructor() {
        IdAwareResource<HasMetadata> idAwareResource = new IdAwareResource<>(mockHasMetadata);

        Assertions.assertNotNull(idAwareResource);
        Assertions.assertEquals(name, idAwareResource.getId());
        Assertions.assertEquals(mockHasMetadata, idAwareResource.getResource());
    }

    @Test
    public void testSetIdAndSetResource() {
        IdAwareResource<HasMetadata> idAwareResource = new IdAwareResource<>(mockHasMetadata);
        String newName = "new-crd";
        idAwareResource.setId(newName);

        Assertions.assertEquals(newName, idAwareResource.getId());

        HasMetadata newMockHasMetadata = Mockito.mock(HasMetadata.class);
        ObjectMeta newMockObjectMeta = Mockito.mock(ObjectMeta.class);
        Mockito.when(newMockHasMetadata.getMetadata()).thenReturn(newMockObjectMeta);
        Mockito.when(newMockObjectMeta.getName()).thenReturn(newName);

        idAwareResource.setResource(newMockHasMetadata);

        Assertions.assertEquals(newMockHasMetadata, idAwareResource.getResource());
        Assertions.assertEquals(newName, idAwareResource.getId());

    }
}
