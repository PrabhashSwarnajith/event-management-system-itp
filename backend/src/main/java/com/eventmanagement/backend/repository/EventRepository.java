package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTitleContainingIgnoreCase(String title);
    List<Event> findByCategory(String category);
    List<Event> findByEventDateBetween(LocalDateTime start, LocalDateTime end);
    List<Event> findByOrganizerId(Long organizerId);
    
    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Event> searchByTitle(@Param("title") String title);
    
    @Query("SELECT e FROM Event e WHERE e.category = :category AND e.eventDate BETWEEN :start AND :end")
    List<Event> filterByCategoryAndDateRange(@Param("category") String category, 
                                             @Param("start") LocalDateTime start, 
                                             @Param("end") LocalDateTime end);
}
