package com.supportticket.backend.service;

import com.supportticket.backend.dto.request.TicketRequest;
import com.supportticket.backend.dto.request.UpdateTicketRequest;
import com.supportticket.backend.dto.response.TicketResponse;
import com.supportticket.backend.entity.User;

import java.util.List;

public interface TicketService {
    TicketResponse createTicket(TicketRequest request, User currentUser);
    TicketResponse getTicketById(Long id, User currentUser);
    List<TicketResponse> getMyTickets(User currentUser);
    List<TicketResponse> getAllTickets();
    TicketResponse updateTicket(Long id, UpdateTicketRequest request, User currentUser);
    void deleteTicket(Long id);
}