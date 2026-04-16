package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(String name, String location);
    List<Venue> findByLocationContainingIgnoreCase(String location);
    List<Venue> findByCapacityGreaterThanEqual(Integer capacity);
    List<Venue> findByAmenitiesContainingIgnoreCase(String amenity);
}
