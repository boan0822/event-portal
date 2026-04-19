package com.github.boan0822.event_portal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public AiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.anthropic.com")
                .build();
    }

    public String generateEventDescription(String keywords) {

        String prompt = String.format(
            "Based on the following keywords, write an attractive event description " +
            "in Traditional Chinese (100-150 characters) for a campus event.\n" +
            "Keywords: %s",
            keywords
        );

        Map<String, Object> requestBody = Map.of(
            "model", "claude-3-5-sonnet-20241022",
            "max_tokens", 1024,
            "messages", List.of(
                Map.of("role", "user", "content", prompt)
            )
        );

        try {
            String rawResponse = webClient.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                            .map(errorBody -> {
                                System.out.println("Claude API 錯誤回應：" + errorBody);
                                return new RuntimeException("Claude API 錯誤：" + errorBody);
                            })
                    )
                    .bodyToMono(String.class)
                    .block();

            System.out.println("Claude 回傳：" + rawResponse);

            com.fasterxml.jackson.databind.ObjectMapper mapper =
                new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(rawResponse);

            return root.path("content").get(0).path("text").asText();

        } catch (Exception e) {
            System.out.println("錯誤詳細：" + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("AI 生成失敗：" + e.getMessage());
        }
    }
}