package com.supportticket.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketHistoryResponse {
    private Long id;
    private String fieldChanged;
    private String oldValue;
    private String newValue;
    private LocalDateTime changedAt;
    private String changedByName;
}