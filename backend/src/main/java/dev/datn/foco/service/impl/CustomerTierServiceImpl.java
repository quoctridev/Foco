package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.CustomerTierRequest;
import dev.datn.foco.model.CustomerTier;
import dev.datn.foco.repository.CustomerTierRepository;
import dev.datn.foco.service.CustomerTierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerTierServiceImpl implements CustomerTierService {
    @Autowired
    private CustomerTierRepository customerTierRepository;

    @Override
    public CustomerTier create(CustomerTierRequest customerTier) {
        if(customerTier == null) {
            throw new IllegalArgumentException("Bạn không thể để trống");
        }
        if(customerTier.getName().length() <= 3){
            throw new IllegalArgumentException("Hạng của bạn không thể ngắn hơn 3 ký tự");
        }
        if(customerTier.getMinPoint()<0){
            throw new IllegalArgumentException("Điểm của hạng này phải lớn hơn 0");
        }
        if(customerTier.getDiscountRate()<0 || customerTier.getDiscountRate()>100){
            throw new IllegalArgumentException("Giảm giá của hạng này phải lớn hơn 0 và nhỏ hơn 100");
        }
        customerTier.setActive(true);
        return customerTierRepository.save(CustomerTier.builder().color(customerTier.getColor()).name(customerTier.getName()).discountRate(customerTier.getDiscountRate()).minPoint(customerTier.getMinPoint()).isActive(customerTier.isActive()).build());
    }

    @Override
    public List<CustomerTier> findAll() {
        if(customerTierRepository.findAll().isEmpty()){
            throw new IllegalArgumentException("Bạn chưa có danh sách mức hạng vui lòng tạo thêm");
        }
        return customerTierRepository.findAll();
    }

    @Override
    public CustomerTier update(Long id,CustomerTierRequest customerTier) {
        CustomerTier customerSaved = customerTierRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Không thể tìm thấy hạng này"));
        if(customerTier == null) {
            throw new IllegalArgumentException("Bạn không thể để trống");
        }
        if(customerTier.getName().length() <= 3){
            throw new IllegalArgumentException("Hạng của bạn không thể ngắn hơn 3 ký tự");
        }
        if(customerTier.getMinPoint()<0){
            throw new IllegalArgumentException("Điểm của hạng này phải lớn hơn 0");
        }
        if(customerTier.getDiscountRate()<0){
            throw new IllegalArgumentException("Giảm giá của hạng này phải lớn hơn 0");
        }
        customerSaved.setName(customerTier.getName());
        customerSaved.setMinPoint(customerTier.getMinPoint());
        customerSaved.setColor(customerTier.getColor());
        customerSaved.setDiscountRate(customerTier.getDiscountRate());
        customerSaved.setActive(customerTier.isActive());
        return customerTierRepository.save(customerSaved);
    }

    @Override
    public CustomerTier delete(Long id) {
        CustomerTier customerSaved = customerTierRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Không thể tìm thấy hạng này"));
        customerSaved.setActive(false);
        return customerTierRepository.save(customerSaved);
    }
}
