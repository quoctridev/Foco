package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION+"/table")
public class TableController {

}
