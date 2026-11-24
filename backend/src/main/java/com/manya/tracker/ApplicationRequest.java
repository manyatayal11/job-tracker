package com.manya.tracker;

import com.manya.tracker.JobApplication.Status;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ApplicationRequest(
        @NotBlank(message = "Company is required")
        @Size(max = 100, message = "Company must be at most 100 characters")
        String company,

        @NotBlank(message = "Role is required")
        @Size(max = 100, message = "Role must be at most 100 characters")
        String role,

        @NotNull(message = "Status is required")
        Status status,

        @PastOrPresent(message = "Applied date cannot be in the future")
        LocalDate appliedDate,

        @Size(max = 50, message = "Source must be at most 50 characters")
        String source,

        @Size(max = 255, message = "Notes must be at most 255 characters")
        String notes
) {}