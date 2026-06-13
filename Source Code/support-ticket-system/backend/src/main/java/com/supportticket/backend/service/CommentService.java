package com.supportticket.backend.service;

import com.supportticket.backend.dto.request.CommentRequest;
import com.supportticket.backend.dto.response.CommentResponse;
import com.supportticket.backend.entity.User;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(Long ticketId, CommentRequest request, User currentUser);
    List<CommentResponse> getCommentsByTicket(Long ticketId);
}