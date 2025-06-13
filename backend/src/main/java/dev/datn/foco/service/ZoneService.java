package dev.datn.foco.service;

import dev.datn.foco.dto.request.ZoneRequest;
import dev.datn.foco.dto.respone.ZoneRespone;

import java.util.List;

public interface ZoneService {
    List<ZoneRespone> getAllZonesByStore(Long storeId);
    ZoneRespone getZone(Long zoneId);
    ZoneRespone createZone(ZoneRequest zone);
    ZoneRespone updateZone(Long zoneId, ZoneRequest zone);
    ZoneRespone deleteZone(Long zoneId);
}
