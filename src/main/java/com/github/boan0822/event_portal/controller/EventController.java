package com.github.boan0822.event_portal.controller;

import com.github.boan0822.event_portal.dto.EventRequest;
import com.github.boan0822.event_portal.model.Event;
import com.github.boan0822.event_portal.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController           // 這個 class 是 REST API 的 Controller
@RequestMapping("/api/events")  // 所有路由的前綴
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // GET /api/events → 取得所有活動
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // GET /api/events/1 → 取得單一活動
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // POST /api/events → 新增活動
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody EventRequest request) {
        Event created = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/events/1 → 更新活動
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    // DELETE /api/events/1 → 刪除活動
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();  // 204 No Content
    }
}