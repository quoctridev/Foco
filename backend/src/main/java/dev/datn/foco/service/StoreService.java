package dev.datn.foco.service;

import dev.datn.foco.dto.request.StoreRequest;
import dev.datn.foco.dto.respone.StoreResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoreService {
    Page<StoreResponse> getAllStores(Pageable pageable);
    StoreResponse createStore(StoreRequest store);
    StoreResponse updateStore(Long id, StoreRequest request);
    StoreResponse deleteStore(Long id);

}
