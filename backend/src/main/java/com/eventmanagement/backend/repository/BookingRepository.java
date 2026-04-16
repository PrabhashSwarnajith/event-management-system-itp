package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByEventId(Long eventId);
    List<Booking> findByUserIdAndStatus(Long userId, String status);
}
