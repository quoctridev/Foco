package dev.datn.foco.repository;

import dev.datn.foco.dto.request.UserCreateRequest;
import dev.datn.foco.dto.respone.UserRespone;
import dev.datn.foco.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    List<User> findAll();
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
