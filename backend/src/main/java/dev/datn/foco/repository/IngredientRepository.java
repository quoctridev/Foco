package dev.datn.foco.repository;

import dev.datn.foco.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    List<Ingredient> findByActive(Boolean active);

    List<Ingredient> findByCategory(String category);

    List<Ingredient> findByNameContainingIgnoreCase(String name);
}
