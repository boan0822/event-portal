package com.github.boan0822.event_portal.service;

import com.github.boan0822.event_portal.dto.RegistrationRequest;
import com.github.boan0822.event_portal.model.Event;
import com.github.boan0822.event_portal.model.Registration;
import com.github.boan0822.event_portal.repository.EventRepository;
import com.github.boan0822.event_portal.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    // 取得某活動的所有報名紀錄
    public List<Registration> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    // 報名活動（含三個檢查）
    public Registration createRegistration(RegistrationRequest request) {

        // 檢查 1：活動是否存在
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 檢查 2：是否已經報名過（同 email 不能重複報名同一活動）
        boolean alreadyRegistered = registrationRepository
                .existsByEventIdAndAttendeeEmail(request.getEventId(), request.getAttendeeEmail());
        if (alreadyRegistered) {
            throw new RuntimeException("This email has already registered for this event");
        }

        // 檢查 3：名額是否已滿
        long currentCount = registrationRepository.countByEventId(request.getEventId());
        if (currentCount >= event.getCapacity()) {
            throw new RuntimeException("Event is fully booked");
        }

        // 三個檢查都通過才建立報名紀錄
        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setAttendeeName(request.getAttendeeName());
        registration.setAttendeeEmail(request.getAttendeeEmail());
        return registrationRepository.save(registration);
    }

    // 取消報名
    public void deleteRegistration(Long id) {
        if (!registrationRepository.existsById(id)) {
            throw new RuntimeException("Registration not found");
        }
        registrationRepository.deleteById(id);
    }
}