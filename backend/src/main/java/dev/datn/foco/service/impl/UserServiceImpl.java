package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.UserCreateRequest;
import dev.datn.foco.dto.request.UserUpdateRequest;
import dev.datn.foco.dto.respone.UserRespone;
import dev.datn.foco.model.User;
import dev.datn.foco.repository.UserRepository;
import dev.datn.foco.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UserRespone findById(long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Tài khoản ID " + id + " không tồn tại!");
        }
        return UserRespone.builder()
                .id(user.get().getUserId())
                .name(user.get().getName())
                .username(user.get().getUsername())
                .email(user.get().getEmail())
                .phone(user.get().getPhone())
                .roleId(user.get().getRole().getRoleId())
                .storeId(user.get().getStoreId())
                .isActive(user.get().isActive())
                .createdAt(user.get().getCreatedAt())
                .build();
    }


    @Override
    public UserRespone create(UserCreateRequest user) {
        Optional<User> findUserByUsername= userRepository.findByUsername(user.getUsername());
        if (findUserByUsername.isPresent()) {
            throw new IllegalArgumentException("Tài khoản " + user.getUsername() + " đã có");
        }
        Optional<User> findUserByEmail = userRepository.findByEmail(user.getEmail());
        if (findUserByEmail.isPresent()) {
            throw new IllegalArgumentException("Tài khoản này đã có!");
        }
        String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        String regexPhone = "^(03|05|07|08|09|01[2689])[0-9]{8}$";
        String email = user.getEmail();
        String phone = user.getPhone();
        if (email == null||!email.matches(regexEmail) ) {
            throw new IllegalArgumentException("Email không phù hợp");
        }
        if (phone == null||!phone.matches(regexPhone) ) {
            throw new IllegalArgumentException("Số điện thoại không phù hợp!");
        }
        String passwordEncode = passwordEncoder.encode(user.getPassword());
        user.setPassword(passwordEncode);
        User userEntity = User.builder()
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .password(passwordEncode)
                .storeId(user.getStoreId())
                .role(user.getRole())
                .isActive(true)
                .build();
        User saved = userRepository.save(userEntity);
        return UserRespone.builder()
                .id(saved.getUserId())
                .name(saved.getName())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .roleId(saved.getRole().getRoleId())
                .storeId(saved.getStoreId())
                .isActive(saved.isActive())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public UserRespone update(UserUpdateRequest user, long id) {
        User saved = userRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Tài khoản ID \" + id + \" không tồn tại!")) ;
        String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        String regexPhone = "^(03|05|07|08|09|01[2689])[0-9]{8}$";
        String email = user.getEmail();
        String phone = user.getPhone();
        if (!email.matches(regexEmail) ) {
            throw new IllegalArgumentException("Email không phù hợp");
        }
        if (email != null && !email.equals(saved.getEmail())) {
            Optional<User> userWithEmail = userRepository.findByEmail(email);
            // Nếu tìm thấy user khác đang dùng email này => lỗi
            if (userWithEmail.isPresent() && !userWithEmail.get().getUserId().equals(saved.getUserId())) {
                System.out.println(userWithEmail.get().getUserId());
                System.out.println(saved.getUserId());
                System.out.println(!userWithEmail.get().getUserId().equals(saved.getUserId()));
                throw new IllegalArgumentException("Email đã tồn tại trong hệ thống!");
            }
            saved.setEmail(email);
        }

        if (user.getUsername() != null && !user.getUsername().equals(saved.getUsername())) {
            Optional<User> userWithUsername = userRepository.findByUsername(user.getUsername());
            // Nếu tìm thấy user khác đang dùng username này => lỗi
            if (userWithUsername.isPresent() && !userWithUsername.get().getUserId().equals(saved.getUserId())) {
                throw new IllegalArgumentException("Username đã tồn tại trong hệ thống!");
            }
            saved.setUsername(user.getUsername());
        }

        if (phone == null||!phone.matches(regexPhone) ) {
            throw new IllegalArgumentException("Số điện thoại không phù hợp!");
        }
        if (user.getPassword() !=null && !passwordEncoder.matches(user.getPassword(), saved.getPassword())) {
            saved.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        saved.setName(user.getName());
        saved.setUsername(user.getUsername());
        saved.setPhone(user.getPhone());
        saved.setStoreId(user.getStoreId());
        saved.setRole(user.getRoleId());
        saved.setUpdatedAt(LocalDateTime.now());
        userRepository.save(saved);
        return UserRespone.builder()
                .id(saved.getUserId())
                .name(saved.getName())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .phone(saved.getPhone())
                .roleId(saved.getRole().getRoleId())
                .storeId(saved.getStoreId())
                .isActive(saved.isActive())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public void delete(long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Tài khoản ID " + id + " không tồn tại!");
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<UserRespone> findAll() {
        List<UserRespone> result = new ArrayList<>();
        List<User> users = userRepository.findAll();
        if(users.isEmpty() || users.size()==0) {
            throw new IllegalArgumentException("Chưa có tài khoản nào");
        }
        for (User user : users) {
            result.add(UserRespone.builder().name(user.getName()).storeId(user.getStoreId()).email(user.getEmail()).phone(user.getPhone()).username(user.getUsername()).id(user.getUserId()).isActive(user.isActive()).createdAt(user.getCreatedAt()).build());
        }
        return result;
    }
}
