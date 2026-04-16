package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategoryContainingIgnoreCase(String category);
    List<Event> findByTitleContainingIgnoreCase(String title);
    List<Event> findByOrganizerId(Long organizerId);
}
