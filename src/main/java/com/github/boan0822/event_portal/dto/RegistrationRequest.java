package com.github.boan0822.event_portal.dto;

import lombok.Data;

@Data
public class RegistrationRequest {
    private Long eventId;
    private String attendeeName;
    private String attendeeEmail;
}
