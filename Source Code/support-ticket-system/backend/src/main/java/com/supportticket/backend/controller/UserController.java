package com.supportticket.backend.controller;

import com.supportticket.backend.dto.response.ApiResponse;
import com.supportticket.backend.dto.response.UserResponse;
import com.supportticket.backend.entity.User;
import com.supportticket.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(
                ApiResponse.success("Profile retrieved",
                        userService.getCurrentUserProfile(currentUser)));
    }
}