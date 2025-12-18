package dev.datn.foco.repository;

import dev.datn.foco.model.MergedTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MergedTableRepository extends JpaRepository<MergedTable, Long> {

    @Query("SELECT mt FROM MergedTable mt WHERE mt.mainTable.id = :tableId AND mt.unmergedAt IS NULL")
    List<MergedTable> findActiveByMainTable(@Param("tableId") Long tableId);

    @Query("SELECT mt FROM MergedTable mt WHERE (mt.mainTable.id = :tableId OR mt.mergedTable.id = :tableId) AND mt.unmergedAt IS NULL")
    List<MergedTable> findActiveByTable(@Param("tableId") Long tableId);

    List<MergedTable> findByMainTableIdOrMergedTableId(Long mainTableId, Long mergedTableId);
}
