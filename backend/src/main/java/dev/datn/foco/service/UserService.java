package dev.datn.foco.service;

import dev.datn.foco.dto.request.UserCreateRequest;
import dev.datn.foco.dto.request.UserUpdateRequest;
import dev.datn.foco.dto.respone.UserRespone;
import dev.datn.foco.model.User;

import java.util.List;

public interface UserService {
    UserRespone findById(long id);
    UserRespone create(UserCreateRequest user);
    UserRespone update(UserUpdateRequest user, long id);
    void delete(long id);
    List<UserRespone> findAll();
}
