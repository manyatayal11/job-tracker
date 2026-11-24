package com.manya.tracker;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repo;
    private final UserRepository users;

    public JobApplicationService(JobApplicationRepository repo, UserRepository users) {
        this.repo = repo;
        this.users = users;
    }

    public List<ApplicationResponse> getAll(String email) {
        User user = currentUser(email);
        return repo.findByUserId(user.getId()).stream().map(ApplicationResponse::from).toList();
    }

    public ApplicationResponse create(String email, ApplicationRequest req) {
        JobApplication app = new JobApplication();
        app.setUser(currentUser(email));
        apply(app, req);
        return ApplicationResponse.from(repo.save(app));
    }

    public ApplicationResponse update(String email, Long id, ApplicationRequest req) {
        JobApplication app = findOwned(email, id);
        apply(app, req);
        return ApplicationResponse.from(repo.save(app));
    }

    public void delete(String email, Long id) {
        repo.delete(findOwned(email, id));
    }

    private JobApplication findOwned(String email, Long id) {
        User user = currentUser(email);
        return repo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application " + id + " not found"));
    }

    private User currentUser(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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