package com.github.boan0822.event_portal.controller;

import com.github.boan0822.event_portal.dto.AiRequest;
import com.github.boan0822.event_portal.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    // POST /api/ai/generate-description
    // 傳入關鍵字，回傳 AI 產生的活動描述
    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(
            @RequestBody AiRequest request) {

        String description = aiService.generateEventDescription(request.getKeywords());

        // 回傳 JSON 格式：{ "description": "生成的文字..." }
        return ResponseEntity.ok(Map.of("description", description));
    }
}