package dev.datn.foco.controller;

import dev.datn.foco.constaint.ApiVersion;
import dev.datn.foco.dto.ApiRespone;
import dev.datn.foco.dto.request.StoreRequest;
import dev.datn.foco.dto.respone.StoreRespone;
import dev.datn.foco.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@Controller
@RestController
@RequestMapping(ApiVersion.API_VERSION+"/stores")
public class StoreController {
    @Autowired
    private StoreService storeService;
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<StoreRespone>> getStores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort
    ) {
        Sort sortObj = Sort.by(Arrays.stream(sort)
                .map(s -> {
                    String[] parts = s.split(",");
                    String field = parts[0];
                    String direction = parts.length > 1 ? parts[1] : "asc";
                    return new Sort.Order(Sort.Direction.fromString(direction), field);
                }).toList());


        Pageable pageable = PageRequest.of(page, size, sortObj);

        return ResponseEntity.ok(storeService.getAllStores(pageable));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiRespone<StoreRespone> createStore(@RequestBody StoreRequest store) {
        return ApiRespone.<StoreRespone>builder().code(200).data(storeService.createStore(store)).message("Bạn đã tạo cơ sở thành công").build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ApiRespone<StoreRespone> updateStore(@RequestParam long id,@RequestBody StoreRequest store) {
        return ApiRespone.<StoreRespone>builder().code(200).data(storeService.updateStore(id, store)).message("Bạn đã sửa cơ sở thành công").build();
    }
}
