package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.VenueRequest;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Venue;
import com.eventmanagement.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    public Venue createVenue(VenueRequest request) {
        Venue venue = new Venue();
        updateVenueFields(venue, request);
        return venueRepository.save(venue);
    }

    public List<Venue> getVenues(String search, String location, Integer minCapacity, String amenity, Boolean available) {
        return venueRepository.findAll().stream()
                .filter(venue -> search == null || search.isBlank()
                        || contains(venue.getName(), search)
                        || contains(venue.getLocation(), search))
                .filter(venue -> location == null || location.isBlank() || contains(venue.getLocation(), location))
                .filter(venue -> minCapacity == null || venue.getCapacity() >= minCapacity)
                .filter(venue -> amenity == null || amenity.isBlank() || contains(venue.getAmenities(), amenity))
                .filter(venue -> available == null || available.equals(venue.getAvailable()))
                .toList();
    }

    public Venue getVenueById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));
    }

    public boolean isVenueAvailable(Long id) {
        Venue venue = getVenueById(id);
        return Boolean.TRUE.equals(venue.getAvailable());
    }

    public Venue updateVenue(Long id, VenueRequest request) {
        Venue venue = getVenueById(id);
        updateVenueFields(venue, request);
        return venueRepository.save(venue);
    }

    public void deleteVenue(Long id) {
        if (!venueRepository.existsById(id)) {
            throw new ResourceNotFoundException("Venue not found with ID: " + id);
        }
        venueRepository.deleteById(id);
    }

    private void updateVenueFields(Venue venue, VenueRequest request) {
        venue.setName(request.getName());
        venue.setLocation(request.getLocation());
        venue.setCapacity(request.getCapacity());
        venue.setDescription(request.getDescription());
        venue.setAmenities(request.getAmenities());
        venue.setImageUrl(request.getImageUrl());
        venue.setAvailable(request.getAvailable() == null || request.getAvailable());
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase().contains(query.toLowerCase());
    }
}
