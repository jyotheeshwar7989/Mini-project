package com.supportticket.backend.dto.response;

import com.supportticket.backend.enums.TicketPriority;
import com.supportticket.backend.enums.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private UserResponse createdBy;
    private UserResponse assignedTo;
    private List<CommentResponse> comments;
    private List<TicketHistoryResponse> history;
}