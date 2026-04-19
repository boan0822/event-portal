package com.github.boan0822.event_portal.repository;

import com.github.boan0822.event_portal.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    
    List<Registration> findByEventId(Long eventId);

    
    boolean existsByEventIdAndAttendeeEmail(Long eventId, String attendeeEmail);

   
    long countByEventId(Long eventId);
}
