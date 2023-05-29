package it.smartcommunitylab.dhub.rm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MainController {

    @GetMapping("/")
    public ModelAndView root() {
        return new ModelAndView("redirect:/index.html");
    }
}
