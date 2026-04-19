package com.github.boan0822.event_portal.controller;

import com.github.boan0822.event_portal.dto.RegistrationRequest;
import com.github.boan0822.event_portal.model.Registration;
import com.github.boan0822.event_portal.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    // GET /api/registrations/event/1 → 查某活動的所有報名
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEvent(eventId));
    }

    // POST /api/registrations → 報名活動
    @PostMapping
    public ResponseEntity<Registration> register(@RequestBody RegistrationRequest request) {
        Registration created = registrationService.createRegistration(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // DELETE /api/registrations/1 → 取消報名
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        registrationService.deleteRegistration(id);
        return ResponseEntity.noContent().build();
    }
}