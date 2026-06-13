package com.supportticket.backend.service.impl;

import com.supportticket.backend.dto.request.CommentRequest;
import com.supportticket.backend.dto.response.CommentResponse;
import com.supportticket.backend.dto.response.UserResponse;
import com.supportticket.backend.entity.Comment;
import com.supportticket.backend.entity.Ticket;
import com.supportticket.backend.entity.User;
import com.supportticket.backend.exception.ResourceNotFoundException;
import com.supportticket.backend.repository.CommentRepository;
import com.supportticket.backend.repository.TicketRepository;
import com.supportticket.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;

    @Override
    public CommentResponse addComment(Long ticketId, CommentRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket not found with id: " + ticketId));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .ticket(ticket)
                .author(currentUser)
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    @Override
    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket not found with id: " + ticketId));

        return commentRepository.findByTicketOrderByCreatedAtAsc(ticket)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .author(UserResponse.builder()
                        .id(comment.getAuthor().getId())
                        .fullName(comment.getAuthor().getFullName())
                        .email(comment.getAuthor().getEmail())
                        .role(comment.getAuthor().getRole().name())
                        .build())
                .build();
    }
}