package com.supportticket.backend.service;

import com.supportticket.backend.dto.response.UserResponse;
import com.supportticket.backend.entity.User;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse getCurrentUserProfile(User user);
    void deleteUser(Long id);
    UserResponse updateUserRole(Long id, String role);
}