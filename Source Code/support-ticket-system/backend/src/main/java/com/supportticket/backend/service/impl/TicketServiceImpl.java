package com.supportticket.backend.service.impl;

import com.supportticket.backend.dto.request.TicketRequest;
import com.supportticket.backend.dto.request.UpdateTicketRequest;
import com.supportticket.backend.dto.response.*;
import com.supportticket.backend.entity.*;
import com.supportticket.backend.enums.Role;
import com.supportticket.backend.enums.TicketStatus;
import com.supportticket.backend.exception.ResourceNotFoundException;
import com.supportticket.backend.exception.UnauthorizedException;
import com.supportticket.backend.repository.*;
import com.supportticket.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketHistoryRepository ticketHistoryRepository;

    @Override
    public TicketResponse createTicket(TicketRequest request, User currentUser) {
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .createdBy(currentUser)
                .build();

        Ticket saved = ticketRepository.save(ticket);
        return mapToResponse(saved);
    }

    @Override
    public TicketResponse getTicketById(Long id, User currentUser) {
        Ticket ticket = findTicketOrThrow(id);

        // Users can only see their own tickets; admins see all
        if (currentUser.getRole() == Role.ROLE_USER &&
                !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to view this ticket");
        }

        return mapToResponse(ticket);
    }

    @Override
    public List<TicketResponse> getMyTickets(User currentUser) {
        return ticketRepository.findByCreatedBy(currentUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponse updateTicket(Long id, UpdateTicketRequest request, User currentUser) {
        Ticket ticket = findTicketOrThrow(id);

        // Track what changed
        if (request.getStatus() != null && !request.getStatus().equals(ticket.getStatus())) {
            saveHistory(ticket, "status",
                    ticket.getStatus().name(), request.getStatus().name(), currentUser);
            ticket.setStatus(request.getStatus());
            if (request.getStatus() == TicketStatus.RESOLVED) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
        }

        if (request.getPriority() != null && !request.getPriority().equals(ticket.getPriority())) {
            saveHistory(ticket, "priority",
                    ticket.getPriority().name(), request.getPriority().name(), currentUser);
            ticket.setPriority(request.getPriority());
        }

        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            String oldAssignee = ticket.getAssignedTo() != null ?
                    ticket.getAssignedTo().getFullName() : "Unassigned";
            saveHistory(ticket, "assignedTo", oldAssignee, assignee.getFullName(), currentUser);
            ticket.setAssignedTo(assignee);
        }

        if (request.getTitle() != null) ticket.setTitle(request.getTitle());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());

        return mapToResponse(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(Long id) {
        Ticket ticket = findTicketOrThrow(id);
        ticketRepository.delete(ticket);
    }

    // ====== HELPERS ======

    private Ticket findTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    private void saveHistory(Ticket ticket, String field,
                             String oldVal, String newVal, User changedBy) {
        TicketHistory history = TicketHistory.builder()
                .ticket(ticket)
                .fieldChanged(field)
                .oldValue(oldVal)
                .newValue(newVal)
                .changedBy(changedBy)
                .build();
        ticketHistoryRepository.save(history);
    }

    public TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .resolvedAt(ticket.getResolvedAt())
                .createdBy(mapUserToResponse(ticket.getCreatedBy()))
                .assignedTo(ticket.getAssignedTo() != null ?
                        mapUserToResponse(ticket.getAssignedTo()) : null)
                .comments(ticket.getComments() != null ?
                        ticket.getComments().stream()
                                .map(this::mapCommentToResponse)
                                .collect(Collectors.toList()) : List.of())
                .history(ticket.getHistory() != null ?
                        ticket.getHistory().stream()
                                .map(this::mapHistoryToResponse)
                                .collect(Collectors.toList()) : List.of())
                .build();
    }

    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private CommentResponse mapCommentToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .author(mapUserToResponse(comment.getAuthor()))
                .build();
    }

    private TicketHistoryResponse mapHistoryToResponse(TicketHistory h) {
        return TicketHistoryResponse.builder()
                .id(h.getId())
                .fieldChanged(h.getFieldChanged())
                .oldValue(h.getOldValue())
                .newValue(h.getNewValue())
                .changedAt(h.getChangedAt())
                .changedByName(h.getChangedBy().getFullName())
                .build();
    }
}