package com.supportticket.backend.controller;

import com.supportticket.backend.dto.request.UpdateTicketRequest;
import com.supportticket.backend.dto.response.ApiResponse;
import com.supportticket.backend.dto.response.TicketResponse;
import com.supportticket.backend.dto.response.UserResponse;
import com.supportticket.backend.entity.User;
import com.supportticket.backend.service.TicketService;
import com.supportticket.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final TicketService ticketService;
    private final UserService userService;

    // === TICKET MANAGEMENT ===

    @GetMapping("/tickets")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAllTickets() {
        return ResponseEntity.ok(
                ApiResponse.success("All tickets retrieved", ticketService.getAllTickets()));
    }

    @PutMapping("/tickets/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicket(
            @PathVariable Long id,
            @RequestBody UpdateTicketRequest request,
            @AuthenticationPrincipal User currentUser) {
        TicketResponse ticket = ticketService.updateTicket(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket updated", ticket));
    }

    @DeleteMapping("/tickets/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(ApiResponse.success("Ticket deleted", null));
    }

    // === USER MANAGEMENT ===

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success("Users retrieved", userService.getAllUsers()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("User retrieved", userService.getUserById(id)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestParam String role) {
        return ResponseEntity.ok(
                ApiResponse.success("Role updated", userService.updateUserRole(id, role)));
    }
}