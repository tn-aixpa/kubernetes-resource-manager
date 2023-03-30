package it.smartcommunitylab.dhub.rm.api;

import it.smartcommunitylab.dhub.rm.SystemKeys;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SystemKeys.API_PATH + "/test")
public class SampleApi {

    @GetMapping
    public String test() {
        return "This is a test";
    }
}
