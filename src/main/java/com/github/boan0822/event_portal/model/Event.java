package com.github.boan0822.event_portal.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data               
@Entity             
@Table(name = "events") 
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(nullable = false)  
    private String title;

    @Column(columnDefinition = "TEXT") 
    private String description;

    private String location;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Integer capacity;

    @CreationTimestamp  
    private LocalDateTime createdAt;
}
