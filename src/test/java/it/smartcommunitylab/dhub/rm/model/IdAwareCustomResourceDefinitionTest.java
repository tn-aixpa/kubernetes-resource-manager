package it.smartcommunitylab.dhub.rm.model;

import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.apiextensions.v1.CustomResourceDefinition;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;

public class IdAwareCustomResourceDefinitionTest {

    @Test
    public void testConstructor() {
        ObjectMeta metadata = new ObjectMeta();
        metadata.setName("test-crd");

        CustomResourceDefinition crd = new CustomResourceDefinition();
        crd.setMetadata(metadata);

        IdAwareCustomResourceDefinition idAwareCrd = new IdAwareCustomResourceDefinition(crd);

        Assertions.assertEquals("test-crd", idAwareCrd.getId());
        Assertions.assertEquals(crd, idAwareCrd.getCrd());
    }

    @Test
    public void testConstructorNullArgument() {
        Executable executable = () -> new IdAwareCustomResourceDefinition(null);
        Assertions.assertThrows(IllegalArgumentException.class, executable);
    }

}

