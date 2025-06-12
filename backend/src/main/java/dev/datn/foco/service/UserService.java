package dev.datn.foco.service;

import dev.datn.foco.dto.request.UserCreateRequest;
import dev.datn.foco.dto.request.UserUpdateRequest;
import dev.datn.foco.dto.respone.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse findById(long id);
    UserResponse create(UserCreateRequest user);
    UserResponse update(UserUpdateRequest user, long id);
    void delete(long id);
    List<UserResponse> findAll();
    List<UserResponse> findByStoreId(long storeId);
}
