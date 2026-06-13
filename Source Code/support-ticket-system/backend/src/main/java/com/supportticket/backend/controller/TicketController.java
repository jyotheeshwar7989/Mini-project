package com.supportticket.backend.controller;

import com.supportticket.backend.dto.request.CommentRequest;
import com.supportticket.backend.dto.request.TicketRequest;
import com.supportticket.backend.dto.request.UpdateTicketRequest;
import com.supportticket.backend.dto.response.ApiResponse;
import com.supportticket.backend.dto.response.CommentResponse;
import com.supportticket.backend.dto.response.TicketResponse;
import com.supportticket.backend.entity.User;
import com.supportticket.backend.service.CommentService;
import com.supportticket.backend.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;

    // Create a new ticket
    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestBody TicketRequest request,
            @AuthenticationPrincipal User currentUser) {
        TicketResponse ticket = ticketService.createTicket(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket created successfully", ticket));
    }

    // Get a single ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        TicketResponse ticket = ticketService.getTicketById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved", ticket));
    }

    // Get current user's own tickets
    @GetMapping("/my-tickets")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyTickets(
            @AuthenticationPrincipal User currentUser) {
        List<TicketResponse> tickets = ticketService.getMyTickets(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved", tickets));
    }

    // Update ticket (partial update)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicket(
            @PathVariable Long id,
            @RequestBody UpdateTicketRequest request,
            @AuthenticationPrincipal User currentUser) {
        TicketResponse ticket = ticketService.updateTicket(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket updated", ticket));
    }

    // Add a comment to a ticket
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser) {
        CommentResponse comment = commentService.addComment(id, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added", comment));
    }

    // Get all comments for a ticket
    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(
            @PathVariable Long id) {
        List<CommentResponse> comments = commentService.getCommentsByTicket(id);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved", comments));
    }
}