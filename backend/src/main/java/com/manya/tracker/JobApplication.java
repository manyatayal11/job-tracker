package com.manya.tracker;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String role;

    @Enumerated(EnumType.STRING)
    private Status status = Status.APPLIED;

    private LocalDate appliedDate;
    private String source;   // referral, portal, Internshala...
    private String notes;

    public enum Status { APPLIED, OA, INTERVIEW, OFFER, REJECTED }

    @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private User user;
}