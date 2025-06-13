package dev.datn.foco.service.impl;


import dev.datn.foco.dto.request.ZoneRequest;
import dev.datn.foco.dto.respone.ZoneRespone;
import dev.datn.foco.model.Zone;
import dev.datn.foco.repository.StoreRepository;
import dev.datn.foco.repository.ZoneReposiory;
import dev.datn.foco.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ZoneServiceImpl implements ZoneService {
    @Autowired
    private ZoneReposiory zoneReposiory;
    @Autowired
    private StoreRepository storeRepository;

    @Override
    public List<ZoneRespone> getAllZonesByStore(Long storeId) {
        List<Zone> ls = zoneReposiory.findAllByStore_IdAndActiveTrue(storeId);
        if (ls.isEmpty()) {
            throw new IllegalArgumentException("Không có khu vực nào ở cơ sở: " + storeId);
        }
        return ls.stream().map(zone -> getZoneRespone(zone)).collect(Collectors.toList());
    }

    @Override
    public ZoneRespone getZone(Long zoneId) {
        Zone zone = zoneReposiory.findById(zoneId).orElseThrow(()-> new IllegalArgumentException("Bạn không có khu vực này vui lòng thử lại!"));
        return getZoneRespone(zone);
    }

    @Override
    public ZoneRespone updateZone(Long zoneId, ZoneRequest zone) {
        Zone oldZone = zoneReposiory.findById(zoneId).orElseThrow(()->new IllegalArgumentException("Khu vực của bạn không thể sửa"));
        if(!storeRepository.existsById(zone.getStoreId())) {
            throw new IllegalArgumentException("Cửa hàng này không có sẵn vui lòng thử lại");
        }
        oldZone.setName(zone.getName());
        oldZone.setDescription(zone.getDescription());
        oldZone.setActive(zone.isActive());
        oldZone.setStoreId(storeRepository.getById(zone.getStoreId()));
        return getZoneRespone(zoneReposiory.save(oldZone));
    }

    @Override
    public ZoneRespone createZone(ZoneRequest zone) {
        if(!storeRepository.existsById(zone.getStoreId())) {
            throw new IllegalArgumentException("Cửa hàng này không có sẵn vui lòng thử lại");
        }
        return getZoneRespone(zoneReposiory.save(Zone.builder().isActive(true).description(zone.getDescription()).name(zone.getName()).storeId(storeRepository.getById(zone.getStoreId())).build()));
    }

    @Override
    public ZoneRespone deleteZone(Long zoneId) {
        Zone zone = zoneReposiory.findById(zoneId).orElseThrow(()-> new IllegalArgumentException("Khu vực này không có sẵn vui lòng thử lại"));
        zone.setActive(false);
        return getZoneRespone(zoneReposiory.save(zone)) ;
    }

    private ZoneRespone getZoneRespone(Zone zone) {
        return ZoneRespone.builder().id(zone.getId()).name(zone.getName()).storeName(zone.getStoreId().getName()).active(zone.isActive()).description(zone.getDescription()).build();
    }
}
