package it.smartcommunitylab.dhub.rm.model.dto;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;

import it.smartcommunitylab.dhub.rm.model.dto.SecretDTO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class SecretDTOTest {

    @Mock
    private Map<String, String> mockData;

    private SecretDTO secretDTO;

    @Before
    public void setUp() {
        secretDTO = new SecretDTO();
        secretDTO.setName("TestSecret");
        secretDTO.setData(mockData);
    }

    @Test
    public void testGetName() {
        assertEquals("TestSecret", secretDTO.getName());
    }

    @Test
    public void testSetName() {
        secretDTO.setName("NewName");
        assertEquals("NewName", secretDTO.getName());
    }

    @Test
    public void testGetData() {
        // Stubbing behavior for mockData
        when(mockData.get("key1")).thenReturn("value1");

        // Test that the DTO retrieves data correctly
        assertEquals("value1", secretDTO.getData().get("key1"));
    }

    @Test
    public void testSetData() {
        // Prepare test data
        Map<String, String> testData = new HashMap<>();
        testData.put("key1", "value1");
        testData.put("key2", "value2");

        // Set data and verify
        secretDTO.setData(testData);
        assertEquals("value1", secretDTO.getData().get("key1"));
        assertEquals("value2", secretDTO.getData().get("key2"));
    }
}
