package com.manya.tracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<ApplicationResponse> getAll(Principal principal) {
        return service.getAll(principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse create(Principal principal, @Valid @RequestBody ApplicationRequest req) {
        return service.create(principal.getName(), req);
    }

    @PutMapping("/{id}")
    public ApplicationResponse update(Principal principal, @PathVariable Long id,
                                      @Valid @RequestBody ApplicationRequest req) {
        return service.update(principal.getName(), id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Principal principal, @PathVariable Long id) {
        service.delete(principal.getName(), id);
    }
}