package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.TableRequest;
import dev.datn.foco.dto.respone.TableRespone;
import dev.datn.foco.dto.respone.ZoneRespone;
import dev.datn.foco.model.Tables;
import dev.datn.foco.model.Zone;
import dev.datn.foco.repository.TableRepository;
import dev.datn.foco.repository.ZoneReposiory;
import dev.datn.foco.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableServiceImpl implements TableService {
    @Autowired
    private TableRepository tableRepository;
    @Autowired
    private ZoneReposiory zoneRepository;

    @Override
    public List<TableRespone> getAllZonesByStore(Long zone) {
        List<Tables> ls = tableRepository.findAllByZone_IdAndActiveTrue(zone);
        if (ls.isEmpty()) {
            throw new IllegalArgumentException("Không có bàn nào ở khu vực: " + zone);
        }
        return ls.stream().map(tables -> convertToResponse(tables)).collect(Collectors.toList());
    }

    @Override
    public TableRespone create(TableRequest tableRequest) {
        Zone zone = zoneRepository.findById(tableRequest.getZoneId()).orElseThrow(()-> new IllegalArgumentException("Không có khu vực này"));
        Tables table = tableRepository.save(Tables.builder()
                .zoneId(zone)
                .name(tableRequest.getTableName())
                .capacity(tableRequest.getCapacity())
                .status(tableRequest.getStatus())
                .active(tableRequest.isActive()).build());
        return convertToResponse(table);
    }

    @Override
    public TableRespone update(Long id,TableRequest tableRequest) {
        Tables oldTable = tableRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Không có bàn này"));
        oldTable.setName(tableRequest.getTableName());
        oldTable.setActive(tableRequest.isActive());
        oldTable.setCapacity(tableRequest.getCapacity());
        oldTable.setStatus(tableRequest.getStatus());
        tableRepository.save(oldTable);
        return convertToResponse(tableRepository.save(oldTable));
    }

    @Override
    public TableRespone getTable(Long tableId) {
        Tables tables = tableRepository.findById(tableId).orElseThrow(()-> new IllegalArgumentException("Bạn không có bàn này vui lòng thử lại!"));
        return convertToResponse(tables);
    }

    @Override
    public TableRespone updateStatus(Long tableId, String status) {
        Tables tables = tableRepository.findById(tableId).orElseThrow(()-> new IllegalArgumentException("Bàn này không có sẵn vui lòng thử lại"));
        tables.setStatus(status);
        return convertToResponse(tableRepository.save(tables));
    }

    @Override
    public TableRespone deleteTable(Long tableId) {
        Tables tables = tableRepository.findById(tableId).orElseThrow(()-> new IllegalArgumentException("Bàn này không có sẵn vui lòng thử lại"));
        tables.setActive(false);
        return convertToResponse(tableRepository.save(tables)) ;
    }
    private TableRespone convertToResponse(Tables table) {
        return TableRespone.builder()
                .id(table.getId())
                .name(table.getName())
                .zoneName(table.getZoneId().getName()) // lấy tên zone
                .capacity(table.getCapacity())
                .status(table.getStatus())
                .active(table.isActive())
                .build();
    }

}
