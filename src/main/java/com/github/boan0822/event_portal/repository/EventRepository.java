package com.github.boan0822.event_portal.repository;

import com.github.boan0822.event_portal.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
  

   
    List<Event> findByTitleContaining(String keyword);
 
}
