package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.StoreRequest;
import dev.datn.foco.dto.respone.StoreRespone;
import dev.datn.foco.model.Store;
import dev.datn.foco.repository.StoreRepository;
import dev.datn.foco.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreRepository storeRepository;
@Override
    public Page<StoreRespone> getAllStores(Pageable pageable) {
    Page<Store> stores = storeRepository.findAll(pageable);
    if (stores.isEmpty()) {
        throw new IllegalArgumentException("Không tìm thấy cửa hàng nào");
    }

        return stores.map(store->StoreRespone.builder()
                .storeId(store.getStoreId())
                .name(store.getName())
                .phone(store.getPhone())
                .email(store.getEmail())
                .address(store.getAddress())
                .isActive(store.isActive())
                .createdAt(store.getCreatedAt()).build());
    }

    @Override
    public StoreRespone createStore(StoreRequest store){
    if(store.getName() == null || store.getPhone() == null || store.getAddress() == null) {
        throw new IllegalArgumentException("Bạn không thể để trống tên, số điện thoại và địa chỉ");
    }
    String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    String regexPhone = "^(03|05|07|08|09|01[2689])[0-9]{8}$";
    if(store.getEmail() == null || !store.getEmail().matches(regexEmail)) {
        throw new IllegalArgumentException("Email không phù hợp");
    }
    if (!store.getPhone().matches(regexPhone) ) {
        throw new IllegalArgumentException("Số điện thoại không phù hợp!");
    }
    Store storeEntity = storeRepository.save(Store.builder().address(store.getAddress()).phone(store.getPhone()).name(store.getName()).email(store.getEmail()).build());
    return StoreRespone.builder().name(storeEntity.getName()).phone(storeEntity.getPhone()).address(storeEntity.getAddress()).build();
    }
    public StoreRespone updateStore(Long id, StoreRequest request) {
    Store store = storeRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Không tìm thấy cơ sở"));
    String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    String regexPhone = "^(03|05|07|08|09|01[2689])[0-9]{8}$";
    if(request.getEmail() == null || !request.getEmail().matches(regexEmail)) {
        throw new IllegalArgumentException("Email không phù hợp");
    }
    if (request.getPhone() == null||!request.getPhone().matches(regexPhone) ) {
        throw new IllegalArgumentException("Số điện thoại không phù hợp!");
    }
    store.setName(request.getName());
    store.setPhone(request.getPhone());
    store.setEmail(request.getEmail());
    store.setAddress(request.getAddress());
    store.setActive(request.isActive());
    storeRepository.save(store);
    return StoreRespone.builder().name(store.getName()).phone(store.getPhone()).build();
    }
}
