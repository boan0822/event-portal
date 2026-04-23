package com.github.boan0822.event_portal.service;

import com.github.boan0822.event_portal.dto.EventRequest;
import com.github.boan0822.event_portal.model.Event;
import com.github.boan0822.event_portal.repository.EventRepository;
import com.github.boan0822.event_portal.repository.RegistrationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service                  // 告訴 Spring 這是一個 Service 元件
@RequiredArgsConstructor  // Lombok：自動產生 Constructor，讓 Spring 注入 Repository
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    // 取得所有活動
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // 取得單一活動，找不到就丟出例外
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    // 新增活動
    public Event createEvent(EventRequest request) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setCapacity(request.getCapacity());
        return eventRepository.save(event);
    }

    // 更新活動
    public Event updateEvent(Long id, EventRequest request) {
        Event event = getEventById(id);  // 先確認活動存在
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setCapacity(request.getCapacity());
        return eventRepository.save(event);
    }

    // 刪除活動
    public void deleteEvent(Long id) {
        getEventById(id);  // 先確認活動存在，不存在會丟例外
        eventRepository.deleteById(id);
    }
}