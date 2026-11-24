package com.manya.tracker;

import com.manya.tracker.JobApplication.Status;
import java.time.LocalDate;

public record ApplicationResponse(
        Long id,
        String company,
        String role,
        Status status,
        LocalDate appliedDate,
        String source,
        String notes
) {
    public static ApplicationResponse from(JobApplication a) {
        return new ApplicationResponse(a.getId(), a.getCompany(), a.getRole(),
                a.getStatus(), a.getAppliedDate(), a.getSource(), a.getNotes());
    }
}