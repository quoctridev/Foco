package dev.datn.foco.service;

import dev.datn.foco.dto.request.TableRequest;
import dev.datn.foco.dto.respone.TableRespone;

import java.util.List;

public interface TableService {
    List<TableRespone> getAllZonesByStore(Long zone);
    TableRespone create(TableRequest tableRequest);
    TableRespone update(Long id,TableRequest tableRequest);
    TableRespone getTable(Long tableId);
    TableRespone updateStatus(Long tableId, String status);
    TableRespone deleteTable(Long tableId);
}
