package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.AuthRequest;
import dev.datn.foco.dto.request.CustomerCreateRequest;
import dev.datn.foco.dto.request.CustomerUpdateRequest;
import dev.datn.foco.dto.respone.AuthResponse;
import dev.datn.foco.dto.respone.CustomerResponse;
import dev.datn.foco.model.Customer;
import dev.datn.foco.repository.CustomerRepository;
import dev.datn.foco.repository.CustomerTierRepository;
import dev.datn.foco.service.CustomerService;
import dev.datn.foco.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomerTierRepository customerTierRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public CustomerResponse create(CustomerCreateRequest customer) {
        String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        String regexPhone = "^(03|05|07|08|09|01[2689])[0-9]{8}$";
        if (customerRepository.findByPhone(customer.getPhone()).isPresent() ||
                customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Tài khoản này đã đăng ký, vui lòng dùng số điện thoại hoặc email khác");
        }
        if(customerTierRepository.findById(customer.getTier()).isPresent()) {
            throw new RuntimeException("Không có sẵn hạng này vui lòng thử lại");
        }
        if(customer.getName() == null || customer.getName().isBlank()) {
            throw new IllegalArgumentException("Bạn không thể để trống tên");
        }
        if(!customer.getEmail().matches(regexEmail)) {
            throw new IllegalArgumentException("Email không phù hợp vui lòng nhập lại!");
        }
        if(!customer.getPhone().matches(regexPhone)) {
            throw new IllegalArgumentException("Số điện thoại không phù hợp vui lòng nhập lại");
        }
        if(customer.getPassword() == null || customer.getPassword().isBlank() || customer.getPassword().length() < 8) {
            throw new IllegalArgumentException("Mật khẩu quá ngắn vui lòng nhập mật khẩu mạnh hơn");
        }
        String password = passwordEncoder.encode(customer.getPassword());

        Customer cus  =customerRepository.save(Customer.builder().name(customer.getName()).email(customer.getEmail()).phone(customer.getPhone()).active(true).gender(customer.isGender()).points(0.0).tier(customerTierRepository.findById(customer.getTier()).orElseThrow(()->new IllegalArgumentException("Không có hạng này!"))).password(password).build());

        return toCustomerResponse(cus);

    }

    @Override
    public AuthResponse authenticate(AuthRequest authRequest) {
        Customer customer = customerRepository.findByEmail(authRequest.getUsername())
                .or(() -> customerRepository.findByPhone(authRequest.getUsername()))
                .orElseThrow(() -> new IllegalArgumentException("Bạn không có tài khoản, vui lòng đăng ký tài khoản"));
        if(!customer.isActive()){
            throw new IllegalArgumentException("Tài khoản của bạn bị vô hiệu hoá");
        }
        if(!passwordEncoder.matches(authRequest.getPassword(), customer.getPassword())){
            throw new IllegalArgumentException("Mật khẩu cuả bạn không chính xác");
        }
        Map<String,String> token = jwtUtil.generateTokenCustomers(CustomerResponse.builder().phone(customer.getPhone()).email(customer.getEmail()).id(customer.getId()).build());
        return AuthResponse.builder().token(token.get("access_token")).refreshToken(token.get("refresh_token")).authorized(true).build();
    }

    @Override
    public AuthResponse refreshToken(String token) {
        try{
            Claims claims = jwtUtil.extractToken(token, true);
            String username = claims.getSubject();
            Customer customer = customerRepository.findByEmail(username)
                    .or(() -> customerRepository.findByPhone(username))
                    .orElseThrow(() -> new IllegalArgumentException("Bạn không có tài khoản, vui lòng đăng ký tài khoản"));

            Map<String,String> map = jwtUtil.generateTokenCustomers(CustomerResponse.builder().phone(customer.getPhone()).email(customer.getEmail()).build());
            return AuthResponse.builder().token(map.get("access_token")).refreshToken(map.get("refresh_token")).authorized(true).build();
        }catch (Exception e) {
            System.out.println(e.getMessage());
            throw new IllegalArgumentException("Token không hợp lệ hoặc đã hết hạn");
        }
    }

    @Override
    public CustomerResponse findById(String token) {
        Long id = jwtUtil.getId(token);
        if (id == null) {
            throw new IllegalArgumentException("Token không hợp lệ hoặc thiếu thông tin ID");
        }
        Customer cus = customerRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Vui lòng đăng nhập tài khoản của bạn"));
        return toCustomerResponse(cus);
    }

    @Override
    public List<CustomerResponse> findAll() {
        List<Customer> customers = customerRepository.findAll();
        if(customers.isEmpty()){
            throw new IllegalArgumentException("Bạn không có khách hàng nào");
        }
        return customers.stream().map(customer -> toCustomerResponse(customer)).collect(Collectors.toList());
    }

    @Override
    public CustomerResponse updateCustomerByToken(String token, CustomerUpdateRequest customer) {
        Long id = jwtUtil.getId(token);
        if (id == null) {
            throw new IllegalArgumentException("Token không hợp lệ hoặc thiếu thông tin ID");
        }

        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vui lòng đăng nhập tài khoản của bạn"));

        // Kiểm tra tên
        if (customer.getName() == null || customer.getName().isBlank()) {
            throw new IllegalArgumentException("Bạn không thể để trống tên");
        }

        // Regex kiểm tra định dạng
        String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        String regexPhone = "^(03|05|07|08|09|01[2689])[0-9]{8}$";

        if (!customer.getEmail().matches(regexEmail)) {
            throw new IllegalArgumentException("Email không phù hợp, vui lòng nhập lại!");
        }

        if (!customer.getPhone().matches(regexPhone)) {
            throw new IllegalArgumentException("Số điện thoại không phù hợp, vui lòng nhập lại!");
        }

        // Check trùng email/phone khác chính mình
        customerRepository.findByEmail(customer.getEmail())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> { throw new RuntimeException("Email đã được sử dụng"); });

        customerRepository.findByPhone(customer.getPhone())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> { throw new RuntimeException("Số điện thoại đã được sử dụng"); });

        // Cập nhật thông tin
        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        existing.setPhone(customer.getPhone());
        existing.setGender(customer.isGender());

        // Nếu có nhập mật khẩu mới → cập nhật
        if (customer.getPassword() != null && !customer.getPassword().isBlank()) {
            if (customer.getPassword().length() < 8) {
                throw new IllegalArgumentException("Mật khẩu quá ngắn, vui lòng nhập ít nhất 8 ký tự");
            }
            existing.setPassword(passwordEncoder.encode(customer.getPassword()));
        }

        Customer saved = customerRepository.save(existing);
        return toCustomerResponse(saved);
    }

    @Override
    public List<CustomerResponse> findByTierId(Long tierId) {
        List<Customer> tier = customerRepository.findAllByTier_Id(tierId);
        if(tier.isEmpty()){
            throw new IllegalArgumentException("Mức hạng này chưa có ai đạt được");
        }
        return tier.stream().map(customer -> toCustomerResponse(customer)).collect(Collectors.toList());
    }

    @Override
    public CustomerResponse deleteCustomerByToken(String token) {
        Long id = jwtUtil.getId(token);
        if (id == null) {
            throw new IllegalArgumentException("Token không hợp lệ hoặc thiếu thông tin ID");
        }

        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vui lòng đăng nhập tài khoản của bạn"));
        existing.setActive(false);

        return toCustomerResponse(customerRepository.save(existing));
    }
    @Override
    public CustomerResponse updateCustomerById(Long id, CustomerUpdateRequest customer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vui lòng đăng nhập tài khoản của bạn"));

        // Kiểm tra tên
        if (customer.getName() == null || customer.getName().isBlank()) {
            throw new IllegalArgumentException("Bạn không thể để trống tên");
        }

        // Regex kiểm tra định dạng
        String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        String regexPhone = "^(03|05|07|08|09|01[2689])[0-9]{8}$";

        if (!customer.getEmail().matches(regexEmail)) {
            throw new IllegalArgumentException("Email không phù hợp, vui lòng nhập lại!");
        }

        if (!customer.getPhone().matches(regexPhone)) {
            throw new IllegalArgumentException("Số điện thoại không phù hợp, vui lòng nhập lại!");
        }

        // Check trùng email/phone khác chính mình
        customerRepository.findByEmail(customer.getEmail())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> { throw new RuntimeException("Email đã được sử dụng"); });

        customerRepository.findByPhone(customer.getPhone())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> { throw new RuntimeException("Số điện thoại đã được sử dụng"); });

        // Cập nhật thông tin
        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        existing.setPhone(customer.getPhone());
        existing.setGender(customer.isGender());

        // Nếu có nhập mật khẩu mới → cập nhật
        if (customer.getPassword() != null && !customer.getPassword().isBlank()) {
            if (customer.getPassword().length() < 8) {
                throw new IllegalArgumentException("Mật khẩu quá ngắn, vui lòng nhập ít nhất 8 ký tự");
            }
            existing.setPassword(passwordEncoder.encode(customer.getPassword()));
        }

        Customer saved = customerRepository.save(existing);
        return toCustomerResponse(saved);
    }
    @Override
    public CustomerResponse deleteCustomerById(Long id) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vui lòng đăng nhập tài khoản của bạn"));
        existing.setActive(false);

        return toCustomerResponse(customerRepository.save(existing));
    }



    private CustomerResponse toCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .gender(customer.isGender())
                .points(customer.getPoints())
                .tier(customer.getTier())
                .active(customer.isActive())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

}
