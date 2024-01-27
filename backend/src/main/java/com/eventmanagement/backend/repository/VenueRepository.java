package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByLocationContainingIgnoreCase(String location);
    List<Venue> findByCapacityGreaterThanEqual(Integer capacity);
    
    @Query("SELECT v FROM Venue v WHERE LOWER(v.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Venue> searchByLocation(@Param("location") String location);
    
    @Query("SELECT v FROM Venue v WHERE v.capacity >= :minCapacity AND v.location LIKE CONCAT('%', :location, '%')")
    List<Venue> filterByCapacityAndLocation(@Param("minCapacity") Integer minCapacity, 
                                            @Param("location") String location);
}
