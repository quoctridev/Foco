package dev.datn.foco.repository;

import dev.datn.foco.model.BillOfMaterials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillOfMaterialsRepository extends JpaRepository<BillOfMaterials, Long> {

    List<BillOfMaterials> findByMenuItemId(Long menuItemId);

    List<BillOfMaterials> findByIngredientId(Long ingredientId);
}
