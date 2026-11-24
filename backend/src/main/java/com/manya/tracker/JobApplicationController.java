package com.manya.tracker;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationRepository repo;

    public JobApplicationController(JobApplicationRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<JobApplication> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public JobApplication create(@RequestBody JobApplication app) {
        return repo.save(app);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplication> update(@PathVariable Long id,
                                                 @RequestBody JobApplication updated) {
        return repo.findById(id).map(existing -> {
            existing.setCompany(updated.getCompany());
            existing.setRole(updated.getRole());
            existing.setStatus(updated.getStatus());
            existing.setAppliedDate(updated.getAppliedDate());
            existing.setSource(updated.getSource());
            existing.setNotes(updated.getNotes());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}