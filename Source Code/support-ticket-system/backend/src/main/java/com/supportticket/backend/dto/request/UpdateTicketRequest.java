package com.supportticket.backend.dto.request;

import com.supportticket.backend.enums.TicketPriority;
import com.supportticket.backend.enums.TicketStatus;
import lombok.Data;

@Data
public class UpdateTicketRequest {
    private String title;
    private String description;
    private TicketStatus status;
    private TicketPriority priority;
    private Long assignedToId;
}