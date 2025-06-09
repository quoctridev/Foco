package dev.datn.foco.service;

import dev.datn.foco.dto.request.StoreRequest;
import dev.datn.foco.dto.respone.StoreRespone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoreService {
    Page<StoreRespone> getAllStores(Pageable pageable);
    StoreRespone createStore(StoreRequest store);
    StoreRespone updateStore(Long id, StoreRequest request);
}
