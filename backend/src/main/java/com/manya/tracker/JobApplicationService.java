package com.manya.tracker;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repo;

    public JobApplicationService(JobApplicationRepository repo) {
        this.repo = repo;
    }

    public List<ApplicationResponse> getAll() {
        return repo.findAll().stream().map(ApplicationResponse::from).toList();
    }

    public ApplicationResponse create(ApplicationRequest req) {
        JobApplication app = new JobApplication();
        apply(app, req);
        return ApplicationResponse.from(repo.save(app));
    }

    public ApplicationResponse update(Long id, ApplicationRequest req) {
        JobApplication app = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application " + id + " not found"));
        apply(app, req);
        return ApplicationResponse.from(repo.save(app));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Application " + id + " not found");
        }
        repo.deleteById(id);
    }

    private void apply(JobApplication app, ApplicationRequest req) {
        app.setCompany(req.company());
        app.setRole(req.role());
        app.setStatus(req.status());
        app.setAppliedDate(req.appliedDate());
        app.setSource(req.source());
        app.setNotes(req.notes());
    }
}